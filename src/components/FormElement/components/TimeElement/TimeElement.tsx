import { DateTime, dateTimeForTimeZone, getTimeZone } from '@grafana/data';
import { InlineField, TimeOfDayPicker } from '@grafana/ui';
import React, { useCallback } from 'react';

import { TEST_IDS } from '@/constants';
import { FormElementByType, FormElementType, LocalFormElement } from '@/types';
import { applyWidth } from '@/utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.TIME>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.TIME>;

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
 * Time Element
 */
export const TimeElement: React.FC<Props> = ({ element, onChange, timeZone }) => {
  /**
   * To Date Time With Time Zone
   */
  const toDateTimeWithTimeZone = useCallback(
    (date?: string) => {
      return dateTimeForTimeZone(getTimeZone({ timeZone }), date);
    },
    [timeZone]
  );

  return (
    <InlineField
      label={element.title}
      grow={!element.width}
      labelWidth={applyWidth(element.labelWidth)}
      tooltip={element.tooltip}
      transparent={!element.title}
      disabled={element.disabled}
    >
      <TimeOfDayPicker
        data-testid={TEST_IDS.formElements.fieldTime}
        value={element.value ? toDateTimeWithTimeZone(element.value) : toDateTimeWithTimeZone(new Date().toISOString())}
        onChange={(dateTime: DateTime) => {
          onChange<typeof element>({
            ...element,
            value: dateTime.toISOString(),
          });
        }}
      />
    </InlineField>
  );
};
