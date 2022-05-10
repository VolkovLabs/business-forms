import React, { ChangeEvent, useEffect, useState } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { Alert, Button, FieldSet, InlineField, InlineFieldRow, Input, RadioButtonGroup, Slider } from '@grafana/ui';
import { BooleanParameterOptions, ButtonVariant, InputParameterType, RequestMethod } from '../../constants';
import { getStyles } from '../../styles';
import { PanelOptions } from '../../types';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * Panel
 */
export const FormPanel: React.FC<Props> = ({ options, width, height }) => {
  const styles = getStyles();
  const [parameters, setParameters] = useState(options.parameters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  /**
   * Update Request
   */
  const updateRequest = async () => {
    const body: any = {};

    /**
     * Set Headers
     */
    const headers: HeadersInit = new Headers();
    if (options.update.method === RequestMethod.POST) {
      headers.set('Content-Type', options.update.contentType);

      /**
       * Set Parameters
       */
      parameters?.forEach((parameter) => {
        body[parameter.id] = parameter.value;
      });
    }

    /**
     * Fetch
     */
    const response = await fetch(options.update.url, {
      method: options.update.method,
      headers,
      body: JSON.stringify(body),
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
  };

  /**
   * Execute Initial Request
   */
  useEffect(() => {
    /**
     * Check Parameters
     */
    if (!parameters || !parameters.length) {
      return;
    }

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
      const response = await fetch(options.initial.url, {
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
        parameters.forEach((parameter) => {
          parameter.value = body[parameter.id];
        });

        /**
         * Set Parameters
         */
        setParameters(parameters);
        setTitle('Values updated.');
      }

      setLoading(false);
    };

    initialRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Update Parameters from Panel Options
   */
  useEffect(() => {
    setParameters(options.parameters);
  }, [options.parameters]);

  /**
   * Check Parameters
   */
  if (!parameters || !parameters.length) {
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
    <FieldSet
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {parameters.map((parameter) => {
        return (
          <InlineFieldRow key={parameter.id}>
            {parameter.type === InputParameterType.NUMBER && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Input
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.value = event.target.value;
                    setParameters([...parameters]);
                  }}
                  type="number"
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.STRING && (
              <InlineField label={parameter.title} grow labelWidth={10} invalid={parameter.value === ''}>
                <Input
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.value = event.target.value;
                    setParameters([...parameters]);
                  }}
                  type="text"
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.BOOLEAN && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <RadioButtonGroup
                  value={parameter.value}
                  onChange={(value: Boolean) => {
                    parameter.value = value;
                    setParameters([...parameters]);
                  }}
                  options={BooleanParameterOptions}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.SLIDER && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Slider
                  value={parameter.value}
                  onChange={(value: number) => {
                    parameter.value = value;
                    setParameters([...parameters]);
                  }}
                  min={parameter.min || 0}
                  max={parameter.max || 0}
                  step={parameter.step || 0}
                />
              </InlineField>
            )}
          </InlineFieldRow>
        );
      })}

      <div className={cx(styles.button[options.submit.orientation])}>
        <Button
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
          disabled={loading}
          onClick={updateRequest}
          size={options.submit.size}
        >
          {options.submit.text}
        </Button>
      </div>

      {error && (
        <Alert severity="error" title="Request">
          {error}
        </Alert>
      )}
    </FieldSet>
  );
};
