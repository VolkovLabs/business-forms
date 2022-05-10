import React, { ChangeEvent, useState } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { Alert, Button, FieldSet, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { ButtonVariant, InputParameterType, RequestMethod } from '../../constants';
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
  const [values, setValues] = useState({ name: 'Name', amount: 30 } as any);
  const [error, setError] = useState('');

  /**
   * Update
   */
  const update = async () => {
    /**
     * Set Headers
     */
    const requestHeaders: HeadersInit = new Headers();
    if (options.update.method == RequestMethod.POST) {
      requestHeaders.set('Content-Type', options.update.contentType);
    }

    /**
     * Fetch
     */
    const response = await fetch(options.update.url, { method: options.update.method, headers: requestHeaders }).catch(
      (error) => {
        setError(error.message);
      }
    );

    /**
     * Check Response
     */
    if (!response || !response.ok) {
      setError(`Update Error: ${response?.statusText}`);
    }
  };

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
      <FieldSet>
        {options.parameters.map((parameter) => {
          return (
            <InlineFieldRow>
              {parameter.type === InputParameterType.NUMBER && (
                <InlineField label={parameter.id} grow labelWidth={8}>
                  <Input
                    value={values[parameter.id]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setValues({ ...values, [parameter.id]: event.target.value });
                    }}
                    type="number"
                  />
                </InlineField>
              )}

              {parameter.type === InputParameterType.STRING && (
                <InlineField label={parameter.id} grow labelWidth={8} invalid={parameter.value === ''}>
                  <Input
                    value={values[parameter.id]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setValues({ ...values, [parameter.id]: event.target.value });
                    }}
                    type="text"
                  />
                </InlineField>
              )}
            </InlineFieldRow>
          );
        })}
      </FieldSet>

      <div className={cx(styles.button[options.submit.orientation])}>
        <Button
          variant={options.submit.variant as any}
          icon={options.submit.icon}
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
          onClick={update}
        >
          {options.submit.text}
        </Button>
      </div>

      {error && (
        <Alert severity="error" title="Update">
          {error}
        </Alert>
      )}
    </div>
  );
};
