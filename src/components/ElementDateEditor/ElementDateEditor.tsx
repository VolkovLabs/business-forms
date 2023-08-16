import React from 'react';
import { Button, DateTimePicker, InlineField, InlineFieldRow } from '@grafana/ui';
import { dateTime } from '@grafana/data';
import { TestIds } from '../../constants';

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {string}
   */
  value?: string;

  /**
   * On Change
   *
   * @param value
   */
  onChange: (value: string) => void;

  /**
   * Label
   *
   * @type {string}
   */
  label: string;

  /**
   * Data Test id
   */
  'data-testid': string;
}

/**
 * Element Date Editor
 */
export const ElementDateEditor: React.FC<Props> = ({ value, onChange, label, ...restProps }) => (
  <InlineFieldRow {...restProps}>
    {!!value ? (
      <>
        <InlineField label={label} labelWidth={8}>
          <DateTimePicker
            onChange={(dateTime) => {
              onChange(dateTime.toISOString());
            }}
            date={dateTime(value)}
            data-testid={TestIds.formElementsEditor.fieldDateTime}
          />
        </InlineField>
        <Button
          icon="minus"
          onClick={() => {
            onChange('');
          }}
          variant="secondary"
          data-testid={TestIds.formElementsEditor.buttonRemoveDate}
        />
      </>
    ) : (
      <InlineField label={label} labelWidth={8}>
        <Button
          icon="plus"
          onClick={() => {
            onChange(new Date().toISOString());
          }}
          variant="secondary"
          data-testid={TestIds.formElementsEditor.buttonSetDate}
        >
          Set {label} Date
        </Button>
      </InlineField>
    )}
  </InlineFieldRow>
);
