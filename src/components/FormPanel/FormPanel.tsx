import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css, cx } from '@emotion/css';
import { AlertErrorPayload, AlertPayload, AppEvents, dateTime, PanelProps } from '@grafana/data';
import { getAppEvents, getTemplateSrv, locationService, RefreshEvent } from '@grafana/runtime';
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
import { ButtonVariant, FormElementType, LayoutVariant, RequestMethod, TestIds } from '../../constants';
import { useFormElements } from '../../hooks';
import { Styles } from '../../styles';
import { FormElement, PanelOptions } from '../../types';
import { FormElements } from '../FormElements';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [initial, setInitial] = useState<{ [id: string]: any }>({});
  const [updateConfirmation, setUpdateConfirmation] = useState(false);

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
   * Execute Custom Code
   */
  const executeCustomCode = ({
    code,
    initial,
    response,
    initialRequest,
  }: {
    code: string;
    initial: any;
    response?: Response | void;
    initialRequest?: () => void;
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
      replaceVariables(code)
    );

    try {
      f(
        options,
        data,
        response,
        elements,
        locationService,
        templateSrv,
        onOptionsChange,
        initialRequest,
        setInitial,
        initial,
        initial,
        notifyError,
        notifySuccess,
        notifyWarning
      );
    } catch (error: any) {
      setError(error.toString());
    }
  };

  /**
   * Initial Request
   */
  const initialRequest = async () => {
    /**
     * Check Elements
     */
    if (!elements.length || !options.initial.url || options.initial.method === RequestMethod.NONE) {
      /**
       * Execute Custom Code and reset Loading
       */
      executeCustomCode({ code: options.initial.code, initial });
      setLoading(false);

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
    const response = await fetch(replaceVariables(options.initial.url), {
      method: options.initial.method,
      headers,
    }).catch((error: Error) => {
      setError(error.toString());
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
    let json: any = null;
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

      onChangeElements(
        elements.map(({ value, ...rest }) => ({
          ...rest,
          value: valuesMap[rest.id],
        }))
      );

      setInitial({
        ...json,
        ...valuesMap,
      });
      setTitle('Values updated.');
    }

    /**
     * Execute Custom Code and reset Loading
     */
    executeCustomCode({ code: options.initial.code, initial: json, response });
    setLoading(false);
  };

  /**
   * Update Request
   */
  const updateRequest = async () => {
    /**
     * Loading
     */
    setLoading(true);

    /**
     * Execute Custom Code
     */
    if (options.update.method === RequestMethod.NONE) {
      executeCustomCode({ code: options.update.code, initial, initialRequest });
      setLoading(false);

      return;
    }

    /**
     * Set Content Type
     */
    const headers: HeadersInit = new Headers();
    headers.set('Content-Type', options.update.contentType);

    /**
     * Set elements
     */
    const body: any = {};
    elements.forEach((element) => {
      if (!options.update.updatedOnly) {
        body[element.id] = element.value;
        return;
      }

      /**
       * Skip not updated elements
       */
      if (element.value === initial[element.id]) {
        return;
      }

      /**
       * Skip Disabled elements
       */
      if (element.type === FormElementType.DISABLED) {
        return;
      }

      body[element.id] = element.value;
    });

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

    /**
     * Fetch
     */
    const response = await fetch(replaceVariables(options.update.url), {
      method: options.update.method,
      headers,
      body: replaceVariables(JSON.stringify(body)),
    }).catch((error: Error) => {
      setError(error.toString());
    });

    /**
     * Check Response
     */
    if (response?.ok) {
      setTitle(response.toString());
    }

    /**
     * Execute Custom Code and reset Loading
     */
    executeCustomCode({ code: options.update.code, initial, response, initialRequest });
    setLoading(false);
  };

  /**
   * Execute Initial Request
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
  }, [options.initial]);

  /**
   * Check updated values
   */
  const isUpdated = useMemo(() => {
    for (let element of elements) {
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
                  options={options}
                  elements={elements}
                  onChangeElement={onChangeElement}
                  initial={initial}
                  section={null}
                />
              </td>
            </tr>
          )}

          {options.layout.variant === LayoutVariant.SPLIT && (
            <tr>
              {options.layout?.sections?.map((section, id) => {
                return (
                  <td className={styles.td} key={id} data-testid={TestIds.panel.splitLayoutContent(section.name)}>
                    <FieldSet label={section.name}>
                      <FormElements
                        options={options}
                        elements={elements}
                        onChangeElement={onChangeElement}
                        initial={initial}
                        section={section}
                      />
                    </FieldSet>
                  </td>
                );
              })}
            </tr>
          )}
          <tr>
            <td colSpan={options.layout?.sections?.length}>
              <ButtonGroup className={cx(styles.button[options.buttonGroup.orientation])}>
                <Button
                  className={cx(styles.margin)}
                  variant={options.submit.variant as any}
                  icon={options.submit.icon}
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
                  disabled={loading || (!isUpdated && options.layout.variant !== LayoutVariant.NONE)}
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
                    variant={options.reset.variant as any}
                    icon={options.reset.icon}
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
                    disabled={loading}
                    onClick={initialRequest}
                    size={options.buttonGroup.size}
                    data-testid={TestIds.panel.buttonReset}
                  >
                    {options.reset.text}
                  </Button>
                )}

                {options.saveDefault.variant !== ButtonVariant.HIDDEN && canSaveDefaultValues && (
                  <Button
                    className={cx(styles.margin)}
                    variant={options.saveDefault.variant as any}
                    icon={options.saveDefault.icon}
                    disabled={loading}
                    onClick={onSaveUpdates}
                    size={options.buttonGroup.size}
                    data-testid={TestIds.panel.buttonSaveDefault}
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
        title="Confirm update request"
        body={
          <div data-testid={TestIds.panel.confirmModalContent}>
            <h4>Please confirm to update changed values?</h4>
            <table className={styles.confirmTable}>
              <thead>
                <tr className={styles.confirmTable}>
                  <td className={styles.confirmTableTd}>
                    <b>Label</b>
                  </td>
                  <td className={styles.confirmTableTd}>
                    <b>Old Value</b>
                  </td>
                  <td className={styles.confirmTableTd}>
                    <b>New Value</b>
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
        confirmText="Confirm"
        onConfirm={() => {
          updateRequest();
          setUpdateConfirmation(false);
        }}
        onDismiss={() => setUpdateConfirmation(false)}
      />
    </div>
  );
};
