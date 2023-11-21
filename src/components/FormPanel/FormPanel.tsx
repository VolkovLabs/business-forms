import { css, cx } from '@emotion/css';
import {
  AlertErrorPayload,
  AlertPayload,
  AppEvents,
  DataFrame,
  DataQueryError,
  dateTime,
  Field,
  PanelProps,
} from '@grafana/data';
import {
  FetchResponse,
  getAppEvents,
  getTemplateSrv,
  locationService,
  RefreshEvent,
  toDataQueryResponse,
} from '@grafana/runtime';
import {
  Alert,
  Button,
  ButtonGroup,
  ConfirmModal,
  FieldSet,
  usePanelContext,
  useStyles2,
  useTheme2,
} from '@grafana/ui';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ContentType,
  FormElementType,
  LayoutOrientation,
  LayoutVariant,
  LoadingMode,
  PayloadMode,
  RequestMethod,
  ResetActionMode,
  TestIds,
} from '../../constants';
import { useDatasourceRequest, useFormElements } from '../../hooks';
import { Styles } from '../../styles';
import { ButtonVariant, FormElement, LocalFormElement, PanelOptions } from '../../types';
import {
  ConvertToElementValue,
  GetButtonVariant,
  GetFieldValues,
  GetInitialValuesMap,
  GetPayloadForRequest,
  ToFormData,
  ToJSON,
} from '../../utils';
import { FormElements } from '../FormElements';
import { LoadingBar } from '../LoadingBar';

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
}) => {
  const [loading, setLoading] = useState<LoadingMode>(LoadingMode.INITIAL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [initial, setInitial] = useState<{ [id: string]: unknown }>({});
  const [updateConfirmation, setUpdateConfirmation] = useState(false);

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
   * Form Elements
   */
  const { elements, onChangeElement, onChangeElements, onSaveUpdates } = useFormElements(
    onChangeOptions,
    options.elements,
    false
  );

  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(Styles);

  /**
   * Template Service
   */
  const templateSrv = getTemplateSrv();

  /**
   * Events
   */
  const appEvents = getAppEvents();
  const notifySuccess = (payload: AlertPayload) => appEvents.publish({ type: AppEvents.alertSuccess.name, payload });
  const notifyError = (payload: AlertErrorPayload) => appEvents.publish({ type: AppEvents.alertError.name, payload });
  const notifyWarning = (payload: AlertErrorPayload) =>
    appEvents.publish({ type: AppEvents.alertWarning.name, payload });

  /**
   * On Change Elements With Field Values
   */
  const getElementsWithFieldValues = useCallback(
    (frames: DataFrame[], sourceType: RequestMethod.QUERY | RequestMethod.DATASOURCE): LocalFormElement[] => {
      /**
       * Get elements values
       */
      return elements.map((element): LocalFormElement => {
        const fieldConfig = sourceType === RequestMethod.QUERY ? element.queryField : { value: element.fieldName };
        const field = frames
          .filter((frame) => (fieldConfig?.refId ? frame.refId === fieldConfig.refId : true))
          .reduce((acc: Field | undefined, { fields }) => {
            const field = fields?.find((field: Field) => field.name === fieldConfig?.value);
            if (field) {
              return field;
            }
            return acc;
          }, undefined);

        if (field) {
          /**
           * Update with initial value
           */
          const values = GetFieldValues(field);

          return ConvertToElementValue(element, values[values.length - 1]);
        }

        return element;
      });
    },
    [elements]
  );

  /**
   * Execute Custom Code
   */
  const executeCustomCode = async ({
    code,
    initial,
    response,
    initialRequest,
    currentElements,
  }: {
    code: string;
    initial: unknown;
    response?: FetchResponse | Response | null;
    initialRequest?: () => void;
    currentElements?: LocalFormElement[];
  }) => {
    if (!code) {
      return;
    }

    /**
     * Function
     */
    const f = new Function(
      'options',
      'data',
      'response',
      'elements',
      'onChange',
      'locationService',
      'templateService',
      'onOptionsChange',
      'initialRequest',
      'setInitial',
      'json',
      'initial',
      'notifyError',
      'notifySuccess',
      'notifyWarning',
      'toDataQueryResponse',
      'context',
      replaceVariables(code)
    );

    try {
      await f(
        options,
        data,
        response,
        currentElements || elements,
        onChangeElements,
        locationService,
        templateSrv,
        onOptionsChange,
        initialRequest,
        setInitial,
        initial,
        initial,
        notifyError,
        notifySuccess,
        notifyWarning,
        toDataQueryResponse,
        {
          grafana: {
            locationService,
            templateService: templateSrv,
            notifyError,
            notifySuccess,
            notifyWarning,
          },
          panel: {
            options,
            data,
            onOptionsChange,
            elements: currentElements || elements,
            onChangeElements,
            setInitial,
            initial,
            initialRequest,
            response,
          },
          utils: {
            toDataQueryResponse,
          },
        }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.toString());
      }
    }
  };

  /**
   * Initial Request
   */
  const initialRequest = async () => {
    /**
     * Clear Error
     */
    setError('');

    /**
     * Loading
     */
    setLoading(LoadingMode.INITIAL);

    let currentElements = elements;

    if (
      !elements.length ||
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
      setInitial(GetInitialValuesMap(currentElements));

      /**
       * No method specified
       */
      await executeCustomCode({ code: options.initial.code, initial, currentElements });

      /**
       * Reset Loading
       */
      setLoading(LoadingMode.NONE);

      return;
    }

    let response: Response | FetchResponse | null;
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
      const body = GetPayloadForRequest({
        request: {
          ...options.initial,
          payloadMode: PayloadMode.CUSTOM,
        },
        elements,
        initial,
      });

      response = await datasourceRequest({
        query: body,
        datasource: options.initial.datasource,
        replaceVariables,
      }).catch((error: DataQueryError) => {
        setError(JSON.stringify(error));
        return null;
      });

      if (response && response.ok) {
        /**
         * Change Elements With Data Source Values
         */
        const queryResponse = toDataQueryResponse(response as FetchResponse);
        currentElements = getElementsWithFieldValues(queryResponse.data, RequestMethod.DATASOURCE);

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
      }).catch((error: Error) => {
        setError(error.toString());
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

        currentElements = elements.map(
          (element): LocalFormElement => ConvertToElementValue(element, valuesMap[element.id])
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
  };

  /**
   * Reset Request
   */
  const resetRequest = async () => {
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
      await executeCustomCode({ code: options.resetAction.code, initial });
      setLoading(LoadingMode.NONE);
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
    const payload = GetPayloadForRequest({
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
        updatedOnly: false,
      },
      elements,
      initial,
    });

    /**
     * Datasource query
     */
    const response: FetchResponse | null = await datasourceRequest({
      query: payload,
      datasource: options.resetAction.datasource,
      replaceVariables,
    }).catch((error: DataQueryError) => {
      setError(JSON.stringify(error));
      return null;
    });

    let currentElements = elements;
    if (response && response.ok) {
      /**
       * Change Elements With Data Source Values
       */
      const queryResponse = toDataQueryResponse(response as FetchResponse);
      currentElements = getElementsWithFieldValues(queryResponse.data, RequestMethod.DATASOURCE);

      /**
       * Update Elements
       */
      onChangeElements(currentElements);
    }

    /**
     * Execute Custom Code and reset Loading
     */
    await executeCustomCode({ code: options.resetAction.code, initial, response, currentElements });
    setLoading(LoadingMode.NONE);
  };

  /**
   * Update Request
   */
  const updateRequest = async () => {
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
      await executeCustomCode({ code: options.update.code, initial, initialRequest });
      setLoading(LoadingMode.NONE);

      return;
    }

    /**
     * Set payload
     */
    const payload = GetPayloadForRequest({
      request: options.update,
      elements,
      initial,
    });

    /**
     * Response
     */
    let response: Response | FetchResponse | null;

    /**
     * Datasource query
     */
    if (options.update.method === RequestMethod.DATASOURCE) {
      response = await datasourceRequest({
        query: payload,
        datasource: options.update.datasource,
        replaceVariables,
      }).catch((error: DataQueryError) => {
        setError(JSON.stringify(error));
        return null;
      });
    } else {
      /**
       * Set Content Type
       */
      const headers: HeadersInit = new Headers();
      headers.set('Content-Type', options.update.contentType);

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
        body = ToFormData(payload, replaceVariables);
      } else {
        /**
         * JSON or Text Plain
         */
        body = await ToJSON(payload, replaceVariables);
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
    await executeCustomCode({ code: options.update.code, initial, response, initialRequest });
    setLoading(LoadingMode.NONE);
  };

  /**
   * Execute Initial Request on options.initial or data updates
   */
  useEffect(() => {
    /**
     * On Load
     */
    initialRequest();

    /**
     * On Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe(() => {
      initialRequest();
    });

    return () => {
      subscriber.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.initial, data]);

  /**
   * Check updated values
   */
  const isUpdated = useMemo(() => {
    for (const element of elements) {
      if (element.value !== initial[element.id]) {
        return true;
      }
    }

    return false;
  }, [elements, initial]);

  /**
   * Return
   */
  return (
    <div
      data-testid={TestIds.panel.root}
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
        <div className={styles.loadingBar} data-testid={TestIds.panel.loadingBar}>
          <LoadingBar width={width} />
        </div>
      )}

      {!elements.length && options.layout.variant !== LayoutVariant.NONE && (
        <Alert data-testid={TestIds.panel.infoMessage} severity="info" title="Form Elements">
          Please add elements in Panel Options or Custom Code.
        </Alert>
      )}

      <table className={styles.table}>
        <tbody>
          {options.layout.variant === LayoutVariant.SINGLE && (
            <tr>
              <td data-testid={TestIds.panel.singleLayoutContent}>
                <FormElements
                  data={data}
                  options={options}
                  elements={elements}
                  onChangeElement={onChangeElement}
                  initial={initial}
                  section={null}
                  replaceVariables={replaceVariables}
                />
              </td>
            </tr>
          )}

          {options.layout.variant === LayoutVariant.SPLIT &&
            options.layout.orientation !== LayoutOrientation.VERTICAL && (
              <tr>
                {options.layout?.sections?.map((section, id) => {
                  return (
                    <td className={styles.td} key={id} data-testid={TestIds.panel.splitLayoutContent(section.name)}>
                      <FieldSet label={section.name}>
                        <FormElements
                          data={data}
                          options={options}
                          elements={elements}
                          onChangeElement={onChangeElement}
                          initial={initial}
                          section={section}
                          replaceVariables={replaceVariables}
                        />
                      </FieldSet>
                    </td>
                  );
                })}
              </tr>
            )}

          {options.layout.variant === LayoutVariant.SPLIT &&
            options.layout.orientation === LayoutOrientation.VERTICAL && (
              <>
                {options.layout?.sections?.map((section, id) => {
                  return (
                    <tr key={id}>
                      <td className={styles.td} data-testid={TestIds.panel.splitLayoutContent(section.name)}>
                        <FieldSet label={section.name}>
                          <FormElements
                            options={options}
                            elements={elements}
                            onChangeElement={onChangeElement}
                            initial={initial}
                            section={section}
                            replaceVariables={replaceVariables}
                            data={data}
                          />
                        </FieldSet>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          <tr>
            <td colSpan={options.layout?.sections?.length}>
              <ButtonGroup className={cx(styles.button[options.buttonGroup.orientation])}>
                <Button
                  className={cx(styles.margin)}
                  variant={GetButtonVariant(options.submit.variant)}
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
                  disabled={!!loading || (!isUpdated && options.layout.variant !== LayoutVariant.NONE)}
                  onClick={
                    options.update.confirm
                      ? () => {
                          setUpdateConfirmation(true);
                        }
                      : updateRequest
                  }
                  size={options.buttonGroup.size}
                  data-testid={TestIds.panel.buttonSubmit}
                >
                  {options.submit.text}
                </Button>

                {options.reset.variant !== ButtonVariant.HIDDEN && (
                  <Button
                    className={cx(styles.margin)}
                    variant={GetButtonVariant(options.reset.variant)}
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
                    disabled={!!loading}
                    onClick={resetRequest}
                    size={options.buttonGroup.size}
                    data-testid={TestIds.panel.buttonReset}
                  >
                    {options.reset.text}
                  </Button>
                )}

                {options.saveDefault.variant !== ButtonVariant.HIDDEN && canSaveDefaultValues && (
                  <Button
                    className={cx(styles.margin)}
                    variant={GetButtonVariant(options.saveDefault.variant)}
                    icon={options.saveDefault.icon}
                    disabled={!!loading}
                    onClick={onSaveUpdates}
                    size={options.buttonGroup.size}
                    data-testid={TestIds.panel.buttonSaveDefault}
                    title="Save values in the dashboard. Requires to Save dashboard."
                  >
                    {options.saveDefault.text}
                  </Button>
                )}
              </ButtonGroup>
            </td>
          </tr>
        </tbody>
      </table>

      {error && (
        <Alert data-testid={TestIds.panel.errorMessage} severity="error" title="Request">
          {error}
        </Alert>
      )}

      <ConfirmModal
        isOpen={updateConfirmation}
        title={options.confirmModal.title}
        body={
          <div data-testid={TestIds.panel.confirmModalContent}>
            <h4>{options.confirmModal.body}</h4>
            <table className={styles.confirmTable}>
              <thead>
                <tr className={styles.confirmTable}>
                  <td className={styles.confirmTableTd}>
                    <b>{options.confirmModal.columns.name}</b>
                  </td>
                  <td className={styles.confirmTableTd}>
                    <b>{options.confirmModal.columns.oldValue}</b>
                  </td>
                  <td className={styles.confirmTableTd}>
                    <b>{options.confirmModal.columns.newValue}</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {elements.map((element: FormElement) => {
                  if (element.value === initial[element.id]) {
                    return;
                  }

                  /**
                   * Skip Disabled elements, which can be updated in the custom code as previous values
                   */
                  if (element.type === FormElementType.DISABLED) {
                    return;
                  }

                  /**
                   * Skip Password elements
                   */
                  if (element.type === FormElementType.PASSWORD) {
                    return (
                      <tr
                        className={styles.confirmTable}
                        key={element.id}
                        data-testid={TestIds.panel.confirmModalField(element.id)}
                      >
                        <td className={styles.confirmTableTd} data-testid={TestIds.panel.confirmModalFieldTitle}>
                          {element.title || element.tooltip}
                        </td>
                        <td
                          className={styles.confirmTableTd}
                          data-testid={TestIds.panel.confirmModalFieldPreviousValue}
                        >
                          *********
                        </td>
                        <td className={styles.confirmTableTd} data-testid={TestIds.panel.confirmModalFieldValue}>
                          *********
                        </td>
                      </tr>
                    );
                  }

                  let currentValue = element.value;
                  /**
                   * Convert DateTime object to ISO string
                   */
                  if (element.type === FormElementType.DATETIME) {
                    currentValue = dateTime(element.value).toISOString();
                  }

                  return (
                    <tr
                      className={styles.confirmTable}
                      key={element.id}
                      data-testid={TestIds.panel.confirmModalField(element.id)}
                    >
                      <td className={styles.confirmTableTd} data-testid={TestIds.panel.confirmModalFieldTitle}>
                        {element.title || element.tooltip}
                      </td>
                      <td className={styles.confirmTableTd} data-testid={TestIds.panel.confirmModalFieldPreviousValue}>
                        {initial[element.id] === undefined ? '' : String(initial[element.id])}
                      </td>
                      <td className={styles.confirmTableTd} data-testid={TestIds.panel.confirmModalFieldValue}>
                        {currentValue === undefined ? '' : String(currentValue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
        confirmText={options.confirmModal.confirm}
        onConfirm={() => {
          updateRequest();
          setUpdateConfirmation(false);
        }}
        onDismiss={() => setUpdateConfirmation(false)}
        dismissText={options.confirmModal.cancel}
      />
    </div>
  );
};
