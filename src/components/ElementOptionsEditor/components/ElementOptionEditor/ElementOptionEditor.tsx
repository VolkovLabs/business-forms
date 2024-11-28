import { SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React, { ChangeEvent, useState } from 'react';

import { FORM_ELEMENT_OPTION_DEFAULT, ICON_OPTIONS, SELECT_ELEMENT_OPTIONS, TEST_IDS } from '@/constants';
import { FormElementType } from '@/types';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   */
  option: SelectableValue;

  /**
   * On Change Item
   */
  onChangeItem: (updated: SelectableValue, original?: SelectableValue, checkConflict?: boolean) => boolean;

  /**
   * Icon Enabled
   *
   * @type {boolean}
   */
  iconEnabled?: boolean;
}

/**
 * Element Option Editor
 */
export const ElementOptionEditor: React.FC<Props> = ({ option, onChangeItem, iconEnabled = true }) => {
  /**
   * States
   */
  const [value, setValue] = useState(option.value);

  /**
   * Return
   */
  return (
    <>
      <InlineFieldRow>
        <InlineField label="Type" labelWidth={6}>
          <Select
            options={SELECT_ELEMENT_OPTIONS}
            onChange={(event: SelectableValue) => {
              const newValue =
                event?.value === FormElementType.NUMBER ? Number(option.value) || 0 : String(option.value);

              onChangeItem(
                {
                  ...option,
                  value: newValue,
                  id: newValue.toString(),
                  type: event?.value,
                },
                option
              );
            }}
            width={12}
            value={option.type}
            aria-label={TEST_IDS.formElementsEditor.fieldOptionType}
          />
        </InlineField>
        <InlineField invalid={!option.value} label="Value" labelWidth={6} grow={true}>
          <Input
            placeholder={option.type === FormElementType.NUMBER ? 'number' : 'string'}
            type={option.type === FormElementType.NUMBER ? 'number' : undefined}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setValue(option.type === FormElementType.NUMBER ? Number(event.target.value) : event.target.value);
            }}
            onBlur={() => {
              const newId = value.toString() || FORM_ELEMENT_OPTION_DEFAULT.id;
              onChangeItem(
                {
                  ...option,
                  id: newId,
                  value: value,
                },
                option,
                true
              );
            }}
            value={value}
            data-testid={TEST_IDS.formElementsEditor.fieldOptionValue}
          />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        {iconEnabled && (
          <InlineField label="Icon" labelWidth={6}>
            <Select
              onChange={(event) => {
                onChangeItem({
                  ...option,
                  icon: event?.value,
                });
              }}
              options={ICON_OPTIONS}
              isClearable={true}
              value={option.icon}
              width={12}
              aria-label={TEST_IDS.formElementsEditor.fieldOptionIcon}
            />
          </InlineField>
        )}
        <InlineField label="Label" labelWidth={6} grow={true} shrink={true}>
          <Input
            placeholder="label"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChangeItem({
                ...option,
                label: event.target.value,
              });
            }}
            value={option.label}
            data-testid={TEST_IDS.formElementsEditor.fieldOptionLabel}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};
