import { InlineField } from '@grafana/ui';
import { AutosizeCodeEditor } from '@volkovlabs/components';
import React, { useMemo } from 'react';

import { TEST_IDS } from '@/constants';
import { CodeLanguage, FormElementByType, FormElementType, LocalFormElement } from '@/types';
import { applyLabelStyles, applyWidth } from '@/utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {FormElementByType<LocalFormElement, FormElementType.CODE>}
   */
  element: FormElementByType<LocalFormElement, FormElementType.CODE>;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;
}

/**
 * Code Element
 */
export const CodeElement: React.FC<Props> = ({ element, onChange }) => {
  /**
   * Monaco Options
   */
  const monacoOptions = useMemo(
    () => ({
      formatOnPaste: true,
      formatOnType: true,
      fixedOverflowWidgets: false,
    }),
    []
  );

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
      <AutosizeCodeEditor
        isEscaping={element.isEscaping}
        language={element.language || CodeLanguage.JAVASCRIPT}
        showLineNumbers={true}
        showMiniMap={(element.value?.length || 0) > 100}
        value={element.value || ''}
        height={element.height}
        width={applyWidth(element.width)}
        onBlur={(code) => {
          onChange<typeof element>({
            ...element,
            value: code,
          });
        }}
        monacoOptions={monacoOptions}
        aria-label={TEST_IDS.formElements.fieldCode}
        readOnly={element.disabled}
      />
    </InlineField>
  );
};
