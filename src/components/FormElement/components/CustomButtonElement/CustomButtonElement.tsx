import { Button, InlineField, useTheme2 } from '@grafana/ui';
import React, { useCallback } from 'react';

import { FormElementType, TEST_IDS } from '@/constants';
import { ButtonVariant, CustomButtonShow, ExecuteCustomCodeParams, FormElementByType, LocalFormElement } from '@/types';
import { applyWidth, getButtonVariant } from '@/utils';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   */
  element: FormElementByType<LocalFormElement, FormElementType.BUTTON>;

  /**
   * Execute Custom Code
   *
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;

  /**
   * Elements
   *
   * @type {LocalFormElement[]}
   *
   */
  elements: LocalFormElement[];

  /**
   * Initial values
   *
   * @type {[id: string]: unknown}
   */
  initial: { [id: string]: unknown };
}

/**
 * Custom Button Element
 */
export const CustomButtonElement: React.FC<Props> = ({ element, executeCustomCode, elements, initial }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();

  const executeButtonCode = useCallback(
    async (code: string) => {
      await executeCustomCode({ code: code, currentElements: elements, initial: initial });
    },
    [elements, executeCustomCode, initial]
  );

  /**
   * Content
   */
  const content = (
    <Button
      variant={getButtonVariant(element.variant)}
      style={
        element.variant === ButtonVariant.CUSTOM
          ? {
              background: 'none',
              border: 'none',
              backgroundColor: theme.visualization.getColorByName(element.backgroundColor),
              color: theme.visualization.getColorByName(element.foregroundColor),
            }
          : {}
      }
      icon={element.icon}
      disabled={element.disabled}
      onClick={() => executeButtonCode(element.customCode)}
      size={element.size}
      data-testid={TEST_IDS.formElements.fieldCustomButton(element.id)}
    >
      {element.buttonLabel}
    </Button>
  );

  return (
    <>
      {element.show === CustomButtonShow.FORM ? (
        <InlineField
          grow
          label={element.title}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
          data-testid={TEST_IDS.formElements.fieldCustomButtonContainer}
        >
          {content}
        </InlineField>
      ) : (
        content
      )}
    </>
  );
};
