import { DateTime, dateTime } from '@grafana/data';
import { Button, DateTimePicker, InlineField, InlineFieldRow } from '@grafana/ui';
import React from 'react';

import { TEST_IDS } from '../../constants';

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
            onChange={(dateTime?: DateTime) => {
              if(dateTime) {
                onChange(dateTime.toISOString());
              }
            }}
            date={dateTime(value)}
            data-testid={TEST_IDS.formElementsEditor.fieldDateTime}
          />
        </InlineField>
        <Button
          icon="minus"
          onClick={() => {
            onChange('');
          }}
          variant="secondary"
          data-testid={TEST_IDS.formElementsEditor.buttonRemoveDate}
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
          data-testid={TEST_IDS.formElementsEditor.buttonSetDate}
        >
          Set {label} Date
        </Button>
      </InlineField>
    )}
  </InlineFieldRow>
);
