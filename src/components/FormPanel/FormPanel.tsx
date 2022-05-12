import React, { useEffect, useState } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { getTemplateSrv, locationService, RefreshEvent } from '@grafana/runtime';
import { Alert, Button, ButtonGroup, FieldSet } from '@grafana/ui';
import { ButtonVariant, InputParameterType, LayoutVariant, RequestMethod } from '../../constants';
import { getStyles } from '../../styles';
import { PanelOptions } from '../../types';
import { InputParameters } from '../InputParameters';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * Panel
 */
export const FormPanel: React.FC<Props> = ({ options, width, height, onOptionsChange, eventBus, replaceVariables }) => {
  const styles = getStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  /**
   * Template Service
   */
  const templateSrv: any = getTemplateSrv();

  /**
   * Execute Custom Code
   */
  const executeCustomCode = (code: string, response: Response | void) => {
    if (!code) {
      return;
    }

    const f = new Function(
      'options',
      'response',
      'parameters',
      'locationService',
      'templateService',
      replaceVariables(code)
    );

    try {
      f(options, response, options.parameters, locationService, templateSrv);
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
    }
  };

  /**
   * Update Request
   */
  const updateRequest = async () => {
    const body: any = {};

    /**
     * Loading
     */
    setLoading(true);

    /**
     * Set Headers
     */
    const headers: HeadersInit = new Headers();
    if (
      options.update.method === RequestMethod.POST ||
      options.update.method === RequestMethod.PUT ||
      options.update.method === RequestMethod.PATCH
    ) {
      headers.set('Content-Type', options.update.contentType);

      /**
       * Set Parameters
       */
      options.parameters.forEach((parameter) => {
        body[parameter.id] = parameter.value;
      });
    }

    /**
     * Fetch
     */
    const response = await fetch(replaceVariables(options.update.url), {
      method: options.update.method,
      headers,
      body: replaceVariables(JSON.stringify(body)),
    }).catch((error: Error) => {
      console.error(error);
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
    executeCustomCode(options.update.code, response);
    setLoading(false);
  };

  /**
   * Initial Request
   */
  const initialRequest = async () => {
    /**
     * Set Headers
     */
    const headers: HeadersInit = new Headers();
    if (options.initial.method === RequestMethod.POST) {
      headers.set('Content-Type', options.initial.contentType);
    }

    /**
     * Fetch
     */
    const response = await fetch(replaceVariables(options.initial.url), {
      method: options.initial.method,
      headers,
    }).catch((error: Error) => {
      console.error(error);
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
    if (response?.ok) {
      const body = await response.json();

      /**
       * Set Parameter values
       */
      options.parameters.forEach((parameter) => {
        parameter.value = body[parameter.id];
      });

      /**
       * Set Parameters
       */
      onOptionsChange(options);
      setTitle('Values updated.');
    }

    /**
     * Execute Custom Code and reset Loading
     */
    executeCustomCode(options.initial.code, response);
    setLoading(false);
  };

  /**
   * Execute Initial Request
   */
  useEffect(() => {
    /**
     * Check Parameters
     */
    if (!options.parameters || !options.parameters.length || !options.initial.url) {
      /**
       * Execute Custom Code and reset Loading
       */
      executeCustomCode(options.initial.code);
      setLoading(false);

      return;
    }

    /**
     * On Load
     */
    initialRequest();

    /**
     * On Refresh
     */
    const subscriber = eventBus.getStream(RefreshEvent).subscribe((event) => {
      initialRequest();
    });

    return () => {
      subscriber.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Check Parameters
   */
  if (!options.parameters || !options.parameters.length) {
    return (
      <Alert severity="info" title="Input Parameters">
        Please add parameters in Panel Options.
      </Alert>
    );
  }

  /**
   * Return
   */
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <table className={styles.table}>
        {options.layout.variant === LayoutVariant.SINGLE && (
          <tr>
            <td>
              <FieldSet label={options.layout.textRight}>
                <InputParameters options={options} onOptionsChange={onOptionsChange}></InputParameters>
              </FieldSet>
            </td>
          </tr>
        )}

        {options.layout.variant === LayoutVariant.SPLIT && (
          <tr>
            <td className={styles.td}>
              <FieldSet label={options.layout.textLeft}>
                <InputParameters
                  options={options}
                  hide={[InputParameterType.DISABLED]}
                  onOptionsChange={onOptionsChange}
                ></InputParameters>
              </FieldSet>
            </td>
            <td className={styles.td}>
              <FieldSet label={options.layout.textRight}>
                <InputParameters
                  options={options}
                  display={[InputParameterType.DISABLED]}
                  onOptionsChange={onOptionsChange}
                ></InputParameters>
              </FieldSet>
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
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
                        backgroundColor: options.submit.backgroundColor,
                        color: options.submit.foregroundColor,
                      }
                    : {}
                }
                disabled={loading || !options.update.url}
                onClick={updateRequest}
                size={options.buttonGroup.size}
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
                          backgroundColor: options.reset.backgroundColor,
                          color: options.reset.foregroundColor,
                        }
                      : {}
                  }
                  disabled={loading || !options.initial.url}
                  onClick={initialRequest}
                  size={options.buttonGroup.size}
                >
                  {options.reset.text}
                </Button>
              )}
            </ButtonGroup>
          </td>
        </tr>
      </table>

      {error && (
        <Alert severity="error" title="Request">
          {error}
        </Alert>
      )}
    </div>
  );
};
