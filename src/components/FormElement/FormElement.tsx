import { cx } from '@emotion/css';
import { InterpolateFunction } from '@grafana/data';
import { InlineFieldRow, InlineLabel, useStyles2 } from '@grafana/ui';
import React from 'react';

import { FormElementType, TEST_IDS } from '../../constants';
import { CustomButtonShow, ExecuteCustomCodeParams, LocalFormElement } from '../../types';
import { isFormElementType } from '../../utils';
import {
  BooleanElement,
  CheckboxListElement,
  CodeElement,
  CustomButtonElement,
  DateTimeElement,
  DisabledElement,
  DisabledTextAreaElement,
  FileElement,
  LinkElement,
  NumberElement,
  PasswordElement,
  RadioElement,
  SelectElement,
  SliderElement,
  StringElement,
  TextAreaElement,
  TimeElement,
} from './components';
import { getStyles } from './FormElement.styles';
/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {LocalFormElement}
   */
  element: LocalFormElement;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;

  /**
   * Highlight Class
   */
  highlightClass: (element: LocalFormElement) => string;

  /**
   * Template variables interpolation function
   */
  replaceVariables: InterpolateFunction;

  /**
   * Execute Custom Code
   */
  executeCustomCode: (params: ExecuteCustomCodeParams) => Promise<unknown>;

  /**
   * Elements
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
 * Form Element
 */
export const FormElement: React.FC<Props> = ({
  element,
  onChange,
  highlightClass,
  executeCustomCode,
  elements,
  initial,
}) => {
  /**
   * Styles and Theme
   */
  const styles = useStyles2(getStyles);

  return (
    <InlineFieldRow
      data-testid={TEST_IDS.formElements.element(element.id, element.type)}
      className={cx({
        [styles.rootWithBackground]: !!element.background,
      })}
      style={{
        backgroundColor: element.background || undefined,
      }}
    >
      {isFormElementType(element, FormElementType.NUMBER) && (
        <NumberElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {isFormElementType(element, FormElementType.STRING) && (
        <StringElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {isFormElementType(element, FormElementType.PASSWORD) && (
        <PasswordElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {isFormElementType(element, FormElementType.DISABLED) && <DisabledElement element={element} />}

      {isFormElementType(element, FormElementType.TEXTAREA) && (
        <TextAreaElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {isFormElementType(element, FormElementType.DISABLED_TEXTAREA) && (
        <DisabledTextAreaElement element={element} highlightClass={highlightClass} />
      )}

      {isFormElementType(element, FormElementType.CODE) && <CodeElement element={element} onChange={onChange} />}

      {isFormElementType(element, FormElementType.BOOLEAN) && (
        <BooleanElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {element.type === FormElementType.DATETIME && <DateTimeElement element={element} onChange={onChange} />}

      {element.type === FormElementType.TIME && <TimeElement element={element} onChange={onChange} />}

      {element.type === FormElementType.SLIDER && element.value != null && (
        <SliderElement element={element} onChange={onChange} />
      )}

      {element.type === FormElementType.RADIO && (
        <RadioElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {(element.type === FormElementType.SELECT || element.type === FormElementType.MULTISELECT) && (
        <SelectElement element={element} onChange={onChange} highlightClass={highlightClass} />
      )}

      {element.type === FormElementType.FILE && <FileElement element={element} onChange={onChange} />}

      {element.type === FormElementType.LINK && <LinkElement element={element} />}

      {element.type === FormElementType.CHECKBOX_LIST && <CheckboxListElement element={element} onChange={onChange} />}

      {element.type === FormElementType.CUSTOM_BUTTON && element.show === CustomButtonShow.FORM && (
        <CustomButtonElement
          element={element}
          executeCustomCode={executeCustomCode}
          elements={elements}
          initial={initial}
        />
      )}

      {element.unit && (
        <InlineLabel data-testid={TEST_IDS.formElements.unit} transparent width={4}>
          {element.unit}
        </InlineLabel>
      )}
    </InlineFieldRow>
  );
};
