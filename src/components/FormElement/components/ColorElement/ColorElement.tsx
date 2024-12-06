import { ColorPickerInput, InlineField } from '@grafana/ui';
import React from 'react';

import { TEST_IDS } from '@/constants';
import { FormElementByType, FormElementType, LocalFormElement } from '@/types';
import { applyLabelStyles, applyWidth } from '@/utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.COLOR_PICKER>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.COLOR_PICKER>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Color Element
 */
export const ColorElement: React.FC<Props> = ({ element, onChange }) => {
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
      <ColorPickerInput
        data-testid={TEST_IDS.formElements.fieldColorPicker}
        color={element.value}
        width={applyWidth(element.width)}
        returnColorAs={element.colorFormat}
        onChange={(color) => {
          onChange({
            ...element,
            value: color,
          });
        }}
      />
    </InlineField>
  );
};
