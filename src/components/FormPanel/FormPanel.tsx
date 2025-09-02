import { css, cx } from '@emotion/css';
import {
  AlertErrorPayload,
  AlertPayload,
  AppEvents,
  DataFrame,
  DataQueryError,
  DataQueryResponse,
  Field,
  getFieldDisplayName,
  LoadingState,
  PanelProps,
} from '@grafana/data';
import {
  FetchResponse,
  getAppEvents,
  getBackendSrv,
  getTemplateSrv,
  locationService,
  RefreshEvent,
  toDataQueryResponse,
} from '@grafana/runtime';
import { Alert, Button, ConfirmModal, LoadingBar, usePanelContext, useStyles2, useTheme2 } from '@grafana/ui';
import { useDashboardRefresh, useDatasourceRequest } from '@volkovlabs/components';
import { CustomButtonsRow } from 'components/CustomButtonsRow';
import { debounce, isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ConfirmationElementDisplayMode,
  ContentType,
  LayoutVariant,
  LoadingMode,
  PayloadMode,
  RequestMethod,
  ResetActionMode,
  TEST_IDS,
} from '@/constants';
import { useFormLayout, useMutableState } from '@/hooks';
import {
  ButtonVariant,
  FormElement,
  FormElementType,
  LayoutSection,
  LocalFormElement,
  ModalColumnName,
  PanelOptions,
  UpdateEnabledMode,
} from '@/types';
import {
  convertToElementValue,
  createExecutionCode,
  elementValueChangedCodeParameters,
  fileToBase64,
  formatElementValue,
  getButtonVariant,
  getFieldValues,
  getInitialValuesMap,
  getPayloadForRequest,
  requestCodeParameters,
  toFormData,
  toJson,
  ValueChangedEvent,
} from '@/utils';

import { ElementSections } from '../ElementSections';
import { FormElements } from '../FormElements';
import { getStyles } from './FormPanel.styles';

/**
 * Properties
 */
type Props = PanelProps<PanelOptions>;

/**
 * Panel
 */
export const FormPanel: React.FC<Props> = ({
  options,
  width,
  height,
  onOptionsChange,
  eventBus,
  replaceVariables,
  data,
  timeZone,
}) => {
  /**
   * State
   */
  const [loading, setLoading] = useState<LoadingMode>(LoadingMode.INITIAL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [initial, setInitial, initialRef] = useMutableState<{ [id: string]: unknown }>({});
  const [updateConfirmation, setUpdateConfirmation] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [isInitialized, setInitialized] = useState(false);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Controlled form state
   */
  const [resetEnabled, setResetEnabled] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [saveDefaultEnabled, setSaveDefaultEnabled] = useState(true);

  /**
   * Use Datasource Request
   */
  const datasourceRequest = useDatasourceRequest();

  /**
   * Can User Save Options
   */
  const { canAddAnnotations } = usePanelContext();
  const canSaveDefaultValues = useMemo(() => {
    return canAddAnnotations ? canAddAnnotations() : false;
  }, [canAddAnnotations]);

  /**
   * Change Options
   */
  const onChangeOptions = useCallback(
    (elements: FormElement[]) => {
      onOptionsChange({
        ...options,
        elements,
      });
    },
    [onOptionsChange, options]
  );

  /**
   * Change Sections Options
   */
  const onChangeSectionsOption = useCallback(
    (sections: LayoutSection[]) => {
      onOptionsChange({
        ...options,
        layout: {
          ...options.layout,
          sections: sections,
        },
      });
    },
    [onOptionsChange, options]
  );

  /**
   * Form Elements
   */
  const {
    elements,
    onChangeElement,
    onChangeElements,
    onSaveUpdates,
    eventBus: elementsEventBus,
    elementsRef,
    sectionsExpandedState,
    onChangeSectionExpandedState,
    patchFormValue,
    setFormValue,
    getFormValue,
    addSection,
    removeSection,
    onChangeSections,
    sections,
    assignToSection,
    unassignFromSection,
    getSection,
    getAllSections,
  } = useFormLayout({
    replaceVariables: replaceVariables,
    onChangeElementsOption: onChangeOptions,
    value: options.elements,
    isAutoSave: false,
    layoutSections: options.layout.sections,
    onChangeSectionsOption: onChangeSectionsOption,
  });

  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  /**
   * Template Service
   */
  const templateSrv = getTemplateSrv();

  /**
   * Events
   */
  const appEvents = getAppEvents();
  const notifySuccess = useCallback(
    (payload: AlertPayload) => appEvents.publish({ type: AppEvents.alertSuccess.name, payload }),
    [appEvents]
  );
  const notifyError = useCallback(
    (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertError.name, payload }),
    [appEvents]
  );
  const notifyWarning = useCallback(
    (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertWarning.name, payload }),
    [appEvents]
  );

  /**
   * Refresh dashboard
   */
  const refreshDashboard = useDashboardRefresh();

  /**
   * On Change Elements With Field Values
   */
  const getElementsWithFieldValues = useCallback(
    (frames: DataFrame[], sourceType: RequestMethod.QUERY | RequestMethod.DATASOURCE): LocalFormElement[] => {
      /**
       * Get elements values
       */
      return elementsRef.current.map((element): LocalFormElement => {
        const fieldConfig = sourceType === RequestMethod.QUERY ? element.queryField : { value: element.fieldName };
        const field = frames
          .filter((frame) => (fieldConfig?.refId ? frame.refId === fieldConfig.refId : true))
          .reduce((acc: Field | undefined, frame) => {
            const { fields } = frame;
            const field = fields?.find((field: Field) => {
              /**
               * Get unique field name
               */
              const fieldName = getFieldDisplayName(field, frame, frames);
              return fieldName === fieldConfig?.value;
            });
            if (field) {
              return field;
            }
            return acc;
          }, undefined);

        if (field) {
          /**
           * Update with initial value
           */
          const values = getFieldValues(field);

          /**
           * Supports multi values
           */
          if (element.type === FormElementType.CHECKBOX_LIST || element.type === FormElementType.MULTISELECT) {
            return convertToElementValue(element, values);
          }

          return convertToElementValue(element, values[values.length - 1]);
        }

        return element;
      });
    },
    [elementsRef]
  );

  /**
   * Execute Custom Code
   */
  const executeCustomCode = useCallback(
    async ({
      code,
      initial,
      response,
      initialRequest,
      currentElements,
    }: {
      code: string;
      initial: unknown;
      response?: FetchResponse | Response | DataQueryResponse | null;
      initialRequest?: () => Promise<void>;
      currentElements?: LocalFormElement[];
    }): Promise<void> => {
      if (!code) {
        return;
      }

      /**
       * Function
       */
      const f = createExecutionCode('context', replaceVariables(code));

      try {
        await f(
          requestCodeParameters.create({
            grafana: {
              locationService,
              templateService: templateSrv,
              notifyError,
              notifySuccess,
              notifyWarning,
              eventBus,
              appEvents,
              refresh: () => refreshDashboard(),
              backendService: getBackendSrv(),
            },
            panel: {
              options,
              data,
              onOptionsChange,
              elements: currentElements || elementsRef.current,
              onChangeElements,
              patchFormValue,
              setFormValue,
              formValue: getFormValue(),
              setInitial,
              initial,
              initialRequest,
              response,
              enableSubmit: () => setSubmitEnabled(true),
              disableSubmit: () => setSubmitEnabled(false),
              sectionsUtils: {
                add: addSection,
                update: onChangeSections,
                remove: removeSection,
                assign: assignToSection,
                unassign: unassignFromSection,
                get: getSection,
                getAll: getAllSections,
                collapse: (id: string) => onChangeSectionExpandedState(id, false),
                expand: (id: string) => onChangeSectionExpandedState(id, true),
                toggle: (id: string) => onChangeSectionExpandedState(id, !sectionsExpandedState[id]),
                expandedState: sectionsExpandedState,
              },
            },
            utils: {
              toDataQueryResponse,
              fileToBase64,
            },
          })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.toString());
        }
      }
    },
    [
      replaceVariables,
      templateSrv,
      notifyError,
      notifySuccess,
      notifyWarning,
      eventBus,
      appEvents,
      options,
      data,
      onOptionsChange,
      elementsRef,
      onChangeElements,
      patchFormValue,
      setFormValue,
      getFormValue,
      setInitial,
      addSection,
      onChangeSections,
      removeSection,
      assignToSection,
      unassignFromSection,
      getSection,
      getAllSections,
      sectionsExpandedState,
      refreshDashboard,
      onChangeSectionExpandedState,
    ]
  );

  /**
   * Initial Request
   */
  const initialRequest = useCallback(async () => {
    /**
     * bump request version (latest wins)
     */
    const id = ++requestIdRef.current;

    /**
     * abort previous in-flight fetch (if any)
     */
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    /**
     * Clear Error
     */
    setError('');

    /**
     * Loading
     */
    setLoading(LoadingMode.INITIAL);

    let currentElements = elementsRef.current;

    if (
      !elementsRef.current.length ||
      options.initial.method === RequestMethod.NONE ||
      options.initial.method === RequestMethod.QUERY
    ) {
      if (options.initial.method === RequestMethod.QUERY) {
        /**
         * Change Elements with Query Values
         */
        currentElements = getElementsWithFieldValues(data.series, RequestMethod.QUERY);
      }

      /**
       * Update Elements and Initial values
       */
      onChangeElements(currentElements);
      setInitial(getInitialValuesMap(currentElements));

      /**
       * No method specified
       */
      await executeCustomCode({ code: options.initial.code, initial: initialRef.current, currentElements });

      /**
       * Reset Loading
       */
      setLoading(LoadingMode.NONE);

      return;
    }

    let response: Response | FetchResponse | DataQueryResponse | null;
    let json: { [id: string]: unknown } = {};

    /**
     * Data Source
     */
    if (options.initial.method === RequestMethod.DATASOURCE) {
      if (!options.initial.datasource) {
        /**
         * Show No Data Source Error and Reset Loading
         */
        setError('Please select Data Source for Initial Request.');
        setLoading(LoadingMode.NONE);

        return;
      }

      /**
       * Run Datasource Query
       */
      const payload = await getPayloadForRequest({
        request: {
          ...options.initial,
          payloadMode: PayloadMode.CUSTOM,
        },
        elements: elementsRef.current,
        initial: initialRef.current,
        replaceVariables,
      });

      response = await datasourceRequest({
        query: options.initial.payload,
        datasource: options.initial.datasource,
        replaceVariables,
        payload,
      }).catch((error: DataQueryError) => {
        const errorMessage = `Initial Datasource Error: ${error.message ? error.message : JSON.stringify(error)}`;
        setError(errorMessage);
        return null;
      });

      /**
       * if response has no state property accept as done
       */
      if (response && (!response.hasOwnProperty('state') || response.state === LoadingState.Done)) {
        /**
         * Change Elements With Data Source Values
         */
        currentElements = getElementsWithFieldValues(response.data, RequestMethod.DATASOURCE);

        /**
         * Update Elements and Initial Values
         */
        onChangeElements(currentElements);
        setInitial(
          currentElements.reduce(
            (acc, element) => ({
              ...acc,
              [element.id]: element.value,
            }),
            {}
          )
        );
      }
    } else {
      if (!options.initial.url) {
        /**
         * Show no URL Error and Reset Loading
         */
        setError('Please select URL for Initial Request.');
        setLoading(LoadingMode.NONE);

        return;
      }

      /**
       * Set Content Type
       */
      const headers: HeadersInit = new Headers();
      if (options.initial.method === RequestMethod.POST) {
        headers.set('Content-Type', options.initial.contentType);
      }

      /**
       * Set Header
       */
      options.initial.header?.forEach((parameter) => {
        const name = replaceVariables(parameter.name);
        if (!name) {
          setError(`All request parameters should be defined. Remove empty parameters.`);
          return;
        }

        headers.set(name, replaceVariables(parameter.value));
      });

      /**
       * Fetch
       */
      response = await fetch(replaceVariables(options.initial.url, undefined, encodeURIComponent), {
        method: options.initial.method,
        headers,
        signal: controller.signal,
      }).catch((error: Error) => {
        if (error.name === 'AbortError') {
          return null;
        }
        const errorMessage = `Initial Error: ${error.message ? error.message : error.toString()}`;
        setError(errorMessage);
        return null;
      });

      /**
       * CORS
       */
      if (response?.type === 'opaque') {
        setError('CORS prevents access to the response for Initial values.');
      }

      /**
       * OK
       */
      if (response?.ok) {
        if (id !== requestIdRef.current) {
          return;
        }

        json = await response.json();

        /**
         * Update values
         */
        const valuesMap =
          options.elements?.reduce((acc: Record<string, unknown>, element) => {
            return {
              ...acc,
              [element.id]: json[element.id] !== undefined ? json[element.id] : element.value,
            };
          }, {}) || {};

        currentElements = elementsRef.current.map(
          (element): LocalFormElement => convertToElementValue(element, valuesMap[element.id])
        );

        onChangeElements(currentElements);

        setInitial({
          ...json,
          ...valuesMap,
        });
        setTitle('Values updated.');
      }
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.initial.code, initial: json, response, currentElements });
    setLoading(LoadingMode.NONE);
  }, [
    data.series,
    datasourceRequest,
    elementsRef,
    executeCustomCode,
    getElementsWithFieldValues,
    initialRef,
    onChangeElements,
    options.elements,
    options.initial,
    replaceVariables,
    setInitial,
  ]);

  /**
   * Reset Request
   */
  const resetRequest = useCallback(async () => {
    /**
     * Clear Error
     */
    setError('');

    if (options.resetAction.mode === ResetActionMode.INITIAL) {
      /**
       * Use Initial Request
       */
      await initialRequest();
      return;
    }

    if (options.resetAction.mode === ResetActionMode.CUSTOM) {
      /**
       * Loading
       */
      setLoading(LoadingMode.RESET);

      /**
       * Execute Custom Code and reset Loading
       */
      await executeCustomCode({ code: options.resetAction.code, initial: initialRef.current });
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Loading
     */
    setLoading(LoadingMode.RESET);

    if (!options.resetAction.datasource) {
      /**
       * Show No Data Source Error and Reset Loading
       */
      setError('Please select Data Source for Reset Request.');
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Set payload
     */
    const payload = await getPayloadForRequest({
      request: {
        datasource: options.resetAction.datasource,
        payloadMode: PayloadMode.CUSTOM,
        method: RequestMethod.NONE,
        url: '',
        header: [],
        getPayload: options.resetAction.getPayload,
        contentType: ContentType.PLAIN,
        code: options.resetAction.code,
        highlight: false,
        highlightColor: '',
        confirm: false,
        payload: options.resetAction.payload,
      },
      elements: elementsRef.current,
      initial: initialRef.current,
      replaceVariables,
    });

    /**
     * Datasource query
     */
    const response = await datasourceRequest({
      query: options.resetAction.payload,
      datasource: options.resetAction.datasource,
      replaceVariables,
      payload,
    }).catch((error: DataQueryError) => {
      const errorMessage = `Reset Datasource Error: ${error.message ? error.message : JSON.stringify(error)}`;
      setError(errorMessage);
      return null;
    });

    let currentElements = elementsRef.current;
    if (response && response.state === LoadingState.Done) {
      /**
       * Change Elements With Data Source Values
       */
      currentElements = getElementsWithFieldValues(response.data, RequestMethod.DATASOURCE);

      /**
       * Update Elements
       */
      onChangeElements(currentElements);
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.resetAction.code, initial: initialRef.current, response, currentElements });
    setLoading(LoadingMode.NONE);
  }, [
    datasourceRequest,
    elementsRef,
    executeCustomCode,
    getElementsWithFieldValues,
    initialRef,
    initialRequest,
    onChangeElements,
    options.resetAction.code,
    options.resetAction.datasource,
    options.resetAction.getPayload,
    options.resetAction.mode,
    options.resetAction.payload,
    replaceVariables,
  ]);

  /**
   * Update Request
   */
  const updateRequest = useCallback(async () => {
    /**
     * Clear Error
     */
    setError('');

    /**
     * Loading
     */
    setLoading(LoadingMode.UPDATE);

    /**
     * Execute Custom Code
     */
    if (options.update.method === RequestMethod.NONE) {
      /**
       * Execute Custom Code and reset Loading
       */
      await executeCustomCode({ code: options.update.code, initial: initialRef.current, initialRequest });
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Set payload
     */
    const payload = await getPayloadForRequest({
      request: options.update,
      elements,
      initial: initialRef.current,
      replaceVariables,
    });

    /**
     * Response
     */
    let response: Response | FetchResponse | DataQueryResponse | null;

    /**
     * Datasource query
     */
    if (options.update.method === RequestMethod.DATASOURCE) {
      response = await datasourceRequest({
        query: options.update.payload,
        datasource: options.update.datasource,
        replaceVariables,
        payload,
      }).catch((error: DataQueryError) => {
        const errorMessage = `Update Datasource Error: ${error.message ? error.message : JSON.stringify(error)}`;
        setError(errorMessage);
        return null;
      });
    } else {
      /**
       * Set Content Type
       */
      const headers: HeadersInit = new Headers();

      /**
       * Browser should add header itself for form data content
       */
      if (options.update.contentType !== ContentType.FORMDATA) {
        headers.set('Content-Type', options.update.contentType);
      }

      /**
       * Set Header
       */
      options.update.header?.forEach((parameter) => {
        const name = replaceVariables(parameter.name);
        if (!name) {
          setError(`All request parameters should be defined. Remove empty parameters.`);
          return;
        }

        headers.set(name, replaceVariables(parameter.value));
      });

      let body: string | FormData;

      if (options.update.contentType === ContentType.FORMDATA && payload instanceof Object) {
        /**
         * Form Data
         */
        body = toFormData(payload, replaceVariables);
      } else {
        /**
         * JSON or Text Plain
         */
        body = await toJson(payload, replaceVariables);
      }

      /**
       * Fetch
       */
      response = await fetch(replaceVariables(options.update.url, undefined, encodeURIComponent), {
        method: options.update.method,
        headers,
        body,
      }).catch((error: Error) => {
        setError(error.toString());
        return null;
      });

      /**
       * Check Response
       */
      if (response?.ok) {
        setTitle(response.toString());
      }
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.update.code, initial: initialRef.current, response, initialRequest });
    setLoading(LoadingMode.NONE);
  }, [datasourceRequest, elements, executeCustomCode, initialRef, initialRequest, options.update, replaceVariables]);

  const debouncedRequest = useMemo(() => {
    return debounce(initialRequest, 250);
  }, [initialRequest]);

  /**
   * Execute Initial Request on dashboard or data update
   */
  useEffect(() => {
    /**
     * On Load
     */
    if (
      (data.state === LoadingState.Done || data.state === LoadingState.Streaming) &&
      (options.sync || !isInitialized)
    ) {
      initialRequest();

      /**
       * Set Initialized only when sync disabled to prevent unnecessary re-render
       */
      if (!options.sync) {
        setInitialized(true);
      }
    }

    /**
     * On Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
      if (options.sync) {
        debouncedRequest();
      }
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [options.initial, options.sync, eventBus, data.state, isInitialized, initialRequest, debouncedRequest]);

  /**
   * Check updated values
   */
  const isUpdated = useMemo(() => {
    for (const element of elements) {
      if (!isEqual(initial[element.id], element.value)) {
        return true;
      }
    }

    return false;
  }, [elements, initial]);

  /**
   * Is Submit Disabled
   */
  const isSubmitDisabled = useMemo(() => {
    if (loading) {
      return true;
    }

    if (options.updateEnabled === UpdateEnabledMode.AUTO) {
      return !isUpdated && options.layout.variant !== LayoutVariant.NONE;
    }

    return !submitEnabled;
  }, [isUpdated, loading, options.layout.variant, options.updateEnabled, submitEnabled]);

  /**
   * On Element Value Changed
   */
  const onElementValueChanged = useCallback(
    ({ elements, element }: { elements: LocalFormElement[]; element: LocalFormElement }) => {
      const fn = createExecutionCode('context', replaceVariables(options.elementValueChanged));

      fn(
        elementValueChangedCodeParameters.create({
          element,
          grafana: {
            locationService,
            templateService: templateSrv,
            notifyError,
            notifySuccess,
            notifyWarning,
            eventBus,
            appEvents,
            refresh: () => refreshDashboard(),
          },
          panel: {
            options,
            data,
            onOptionsChange,
            elements,
            onChangeElements,
            patchFormValue,
            setFormValue,
            formValue: getFormValue,
            sectionsUtils: {
              add: addSection,
              update: onChangeSections,
              remove: removeSection,
              assign: assignToSection,
              unassign: unassignFromSection,
              get: getSection,
              getAll: getAllSections,
              collapse: (id: string) => onChangeSectionExpandedState(id, false),
              expand: (id: string) => onChangeSectionExpandedState(id, true),
              toggle: (id: string) => onChangeSectionExpandedState(id, !sectionsExpandedState[id]),
              expandedState: sectionsExpandedState,
            },
            initial: initialRef.current,
            setError,
            enableReset: () => setResetEnabled(true),
            disableReset: () => setResetEnabled(false),
            enableSubmit: () => setSubmitEnabled(true),
            disableSubmit: () => setSubmitEnabled(false),
            enableSaveDefault: () => setSaveDefaultEnabled(true),
            disableSaveDefault: () => setSaveDefaultEnabled(false),
            initialRequest,
          },
          utils: {
            toDataQueryResponse,
          },
        })
      );
    },
    [
      replaceVariables,
      options,
      templateSrv,
      notifyError,
      notifySuccess,
      notifyWarning,
      eventBus,
      appEvents,
      data,
      onOptionsChange,
      onChangeElements,
      patchFormValue,
      setFormValue,
      getFormValue,
      addSection,
      onChangeSections,
      removeSection,
      assignToSection,
      unassignFromSection,
      getSection,
      getAllSections,
      sectionsExpandedState,
      initialRef,
      initialRequest,
      refreshDashboard,
      onChangeSectionExpandedState,
    ]
  );

  /**
   * Subscribe on change value event
   */
  useEffect(() => {
    const subscription = elementsEventBus.subscribe(ValueChangedEvent, (event) => {
      onElementValueChanged(event.payload);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [elementsEventBus, eventBus, onElementValueChanged]);

  /**
   * Return
   */
  return (
    <div
      data-testid={TEST_IDS.panel.root}
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          padding: ${options.layout.padding}px;
        `
      )}
    >
      {loading === LoadingMode.INITIAL && (
        <div className={styles.loadingBar} data-testid={TEST_IDS.panel.loadingBar}>
          <LoadingBar width={width} />
        </div>
      )}

      {!elements.length && options.layout.variant !== LayoutVariant.NONE && (
        <Alert data-testid={TEST_IDS.panel.infoMessage} severity="info" title="Form Elements">
          Please add elements in Panel Options or Custom Code.
        </Alert>
      )}

      <div>
        {options.layout.variant === LayoutVariant.SINGLE ? (
          <div data-testid={TEST_IDS.panel.singleLayoutContent}>
            <FormElements
              data={data}
              options={options}
              elements={elements}
              onChangeElement={onChangeElement}
              initial={initial}
              section={null}
              replaceVariables={replaceVariables}
              executeCustomCode={executeCustomCode}
              timeZone={timeZone}
            />
          </div>
        ) : (
          <ElementSections
            data={data}
            options={options}
            elements={elements}
            sections={sections}
            onChangeElement={onChangeElement}
            initial={initial}
            replaceVariables={replaceVariables}
            sectionsExpandedState={sectionsExpandedState}
            onChangeSectionExpandedState={onChangeSectionExpandedState}
            executeCustomCode={executeCustomCode}
            timeZone={timeZone}
          />
        )}
      </div>
      <div className={cx(styles.buttons, styles.buttonsPosition[options.buttonGroup.orientation])}>
        <CustomButtonsRow
          data={data}
          executeCustomCode={executeCustomCode}
          initial={initial}
          elements={elements}
          replaceVariables={replaceVariables}
        />
        {options.updateEnabled !== UpdateEnabledMode.DISABLED && (
          <Button
            variant={getButtonVariant(options.submit.variant)}
            icon={loading === LoadingMode.UPDATE ? 'fa fa-spinner' : options.submit.icon}
            title={title}
            style={
              options.submit.variant === ButtonVariant.CUSTOM
                ? {
                    background: 'none',
                    border: 'none',
                    backgroundColor: theme.visualization.getColorByName(options.submit.backgroundColor),
                    color: theme.visualization.getColorByName(options.submit.foregroundColor),
                  }
                : {}
            }
            disabled={isSubmitDisabled}
            onClick={
              options.update.confirm
                ? () => {
                    setUpdateConfirmation(true);
                  }
                : updateRequest
            }
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonSubmit}
          >
            {replaceVariables(options.submit.text)}
          </Button>
        )}

        {options.reset.variant !== ButtonVariant.HIDDEN && (
          <Button
            variant={getButtonVariant(options.reset.variant)}
            icon={loading === LoadingMode.RESET ? 'fa fa-spinner' : options.reset.icon}
            style={
              options.reset.variant === ButtonVariant.CUSTOM
                ? {
                    background: 'none',
                    border: 'none',
                    backgroundColor: theme.visualization.getColorByName(options.reset.backgroundColor),
                    color: theme.visualization.getColorByName(options.reset.foregroundColor),
                  }
                : {}
            }
            disabled={!!loading || !resetEnabled}
            onClick={() => {
              if (options.resetAction.confirm) {
                setResetConfirmation(true);
                return;
              }

              resetRequest();
            }}
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonReset}
          >
            {replaceVariables(options.reset.text)}
          </Button>
        )}

        {options.saveDefault.variant !== ButtonVariant.HIDDEN && canSaveDefaultValues && (
          <Button
            variant={getButtonVariant(options.saveDefault.variant)}
            icon={options.saveDefault.icon}
            disabled={!!loading || !saveDefaultEnabled}
            onClick={onSaveUpdates}
            size={options.buttonGroup.size}
            data-testid={TEST_IDS.panel.buttonSaveDefault}
            title="Save values in the dashboard. Requires to Save dashboard."
          >
            {replaceVariables(options.saveDefault.text)}
          </Button>
        )}
      </div>

      {error && (
        <Alert
          data-testid={TEST_IDS.panel.errorMessage}
          severity="error"
          title="Request"
          className={styles.errorMessage}
        >
          {error}
        </Alert>
      )}

      <ConfirmModal
        isOpen={updateConfirmation}
        title={options.confirmModal.title}
        body={
          <div data-testid={TEST_IDS.panel.confirmModalContent}>
            <h4>{options.confirmModal.body}</h4>
            {options.layout.variant !== LayoutVariant.NONE && options.confirmModal.columns.include.length > 0 && (
              <table className={styles.confirmTable}>
                <thead>
                  <tr className={styles.confirmTable}>
                    {options.confirmModal.columns.include.includes(ModalColumnName.NAME) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.name}</b>
                      </td>
                    )}
                    {options.confirmModal.columns.include.includes(ModalColumnName.OLD_VALUE) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.oldValue}</b>
                      </td>
                    )}
                    {options.confirmModal.columns.include.includes(ModalColumnName.NEW_VALUE) && (
                      <td className={styles.confirmTableTd}>
                        <b>{options.confirmModal.columns.newValue}</b>
                      </td>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {elements.map((element) => {
                    /**
                     * Skip not changed element
                     */
                    if (
                      element.value === initial[element.id] &&
                      options.confirmModal.elementDisplayMode !== ConfirmationElementDisplayMode.ALL
                    ) {
                      return;
                    }

                    /**
                     * Skip Disabled elements, which can be updated in the custom code as previous values
                     */
                    if (
                      element.type === FormElementType.DISABLED ||
                      element.type === FormElementType.DISABLED_TEXTAREA
                    ) {
                      return;
                    }

                    /**
                     * Skip hidden element
                     */
                    if (('hidden' in element && element.hidden) || !element.helpers.showIf({ elements })) {
                      return;
                    }

                    return (
                      <tr
                        className={styles.confirmTable}
                        key={element.id}
                        data-testid={TEST_IDS.panel.confirmModalField(element.id)}
                      >
                        {options.confirmModal.columns.include.includes(ModalColumnName.NAME) && (
                          <td className={styles.confirmTableTd} data-testid={TEST_IDS.panel.confirmModalFieldTitle}>
                            {element.title || element.tooltip}
                          </td>
                        )}
                        {options.confirmModal.columns.include.includes(ModalColumnName.OLD_VALUE) && (
                          <td
                            className={styles.confirmTableTd}
                            data-testid={TEST_IDS.panel.confirmModalFieldPreviousValue}
                          >
                            {formatElementValue(element, initial[element.id])}
                          </td>
                        )}
                        {options.confirmModal.columns.include.includes(ModalColumnName.NEW_VALUE) && (
                          <td className={styles.confirmTableTd} data-testid={TEST_IDS.panel.confirmModalFieldValue}>
                            {formatElementValue(element, element.value)}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        }
        confirmText={replaceVariables(options.confirmModal.confirm)}
        onConfirm={() => {
          updateRequest();
          setUpdateConfirmation(false);
        }}
        onDismiss={() => setUpdateConfirmation(false)}
        dismissText={replaceVariables(options.confirmModal.cancel)}
      />

      <ConfirmModal
        isOpen={resetConfirmation}
        title="Confirm reset values"
        body={<div data-testid={TEST_IDS.panel.resetConfirmModal}>Please confirm to reset values</div>}
        confirmText="Confirm"
        onConfirm={() => {
          resetRequest();
          setResetConfirmation(false);
        }}
        onDismiss={() => setResetConfirmation(false)}
      />
    </div>
  );
};
