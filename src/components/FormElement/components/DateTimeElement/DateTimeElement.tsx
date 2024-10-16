import { DateTime, dateTime } from '@grafana/data';
import { DatePickerWithInput, DateTimePicker, InlineField } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '@/constants';
import { FormElementByType, LocalFormElement } from '@/types';
import { applyLabelStyles, applyWidth } from '@/utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.DATETIME> | FormElementByType<LocalFormElement, FormElementType.DATE>}
   */
  element:
    | FormElementByType<LocalFormElement, FormElementType.DATETIME>
    | FormElementByType<LocalFormElement, FormElementType.DATE>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;

  /**
   * Time Zone
   *
   * @type {string}
   */
  timeZone: string;
}

/**
 * Date Time Element
 */
export const DateTimeElement: React.FC<Props> = ({ element, onChange, timeZone }) => {
  return (
    <InlineField
      label={element.title}
      grow={!element.width}
      labelWidth={applyWidth(element.labelWidth)}
      tooltip={element.tooltip}
      transparent={!element.title}
      disabled={element.disabled}
      className={applyLabelStyles(element.labelBackground, element.labelColor)}
    >
      {element.disabled ? (
        <DatePickerWithInput
          onChange={undefined as never}
          value={element.value}
          data-testid={TEST_IDS.formElements.fieldDateTime}
        />
      ) : element.type === FormElementType.DATETIME ? (
        <DateTimePicker
          minDate={element.min ? new Date(element.min) : undefined}
          maxDate={element.max ? new Date(element.max) : undefined}
          date={dateTime(element.value)}
          onChange={(dateTime?: DateTime) => {
            if (dateTime) {
              onChange<typeof element>({
                ...element,
                value: dateTime.toISOString(element.isUseLocalTime),
              });
            }
          }}
          data-testid={TEST_IDS.formElements.fieldDateTime}
          timeZone={timeZone}
        />
      ) : (
        <DatePickerWithInput
          onChange={(date: string | Date) => {
            if (typeof date === 'string') {
              onChange<typeof element>({
                ...element,
                value: date,
              });

              return;
            }
            onChange<typeof element>({
              ...element,
              value: date.toISOString(),
            });
          }}
          placeholder="Set the Date"
          value={element.value}
          data-testid={TEST_IDS.formElements.fieldDate}
        />
      )}
    </InlineField>
  );
};
