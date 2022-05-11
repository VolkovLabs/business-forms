import React, { ChangeEvent, useEffect, useState } from 'react';
import { css, cx } from '@emotion/css';
import { DateTime, PanelProps, SelectableValue } from '@grafana/data';
import { getTemplateSrv, locationService } from '@grafana/runtime';
import {
  Alert,
  Button,
  ButtonGroup,
  DateTimePicker,
  FieldSet,
  InlineField,
  InlineFieldRow,
  Input,
  RadioButtonGroup,
  Select,
  Slider,
  TextArea,
} from '@grafana/ui';
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
export const FormPanel: React.FC<Props> = ({ options, width, height, onOptionsChange }) => {
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
    const f = new Function('options', 'response', 'parameters', 'locationService', 'templateService', code);
    f(options, response, options.parameters, locationService, templateSrv);
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

    initialRequest();
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
    <FieldSet
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {options.parameters.map((parameter) => {
        return (
          <InlineFieldRow key={parameter.id}>
            {parameter.type === InputParameterType.NUMBER && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Input
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.value = event.target.value;
                    onOptionsChange(options);
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
                    onOptionsChange(options);
                  }}
                  type="text"
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.TEXTAREA && (
              <InlineField label={parameter.title} grow labelWidth={10} invalid={parameter.value === ''}>
                <TextArea
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    parameter.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  rows={parameter.rows}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.BOOLEAN && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <RadioButtonGroup
                  value={parameter.value}
                  onChange={(value: Boolean) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  options={BooleanParameterOptions}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.DATETIME && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <DateTimePicker
                  date={parameter.value}
                  onChange={(dateTime: DateTime) => {
                    parameter.value = dateTime;
                    onOptionsChange(options);
                  }}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.SLIDER && parameter.value != null && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Slider
                  value={parameter.value || 0}
                  onChange={(value: number) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  min={parameter.min || 0}
                  max={parameter.max || 0}
                  step={parameter.step || 0}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.RADIO && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <RadioButtonGroup
                  value={parameter.value}
                  onChange={(value: any) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  options={parameter.options || []}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.SELECT && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Select
                  value={parameter.value}
                  onChange={(event: SelectableValue) => {
                    parameter.value = event?.value;
                    onOptionsChange(options);
                  }}
                  options={parameter.options || []}
                />
              </InlineField>
            )}
          </InlineFieldRow>
        );
      })}

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

      {error && (
        <Alert severity="error" title="Request">
          {error}
        </Alert>
      )}
    </FieldSet>
  );
};
