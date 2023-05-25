import { CodeEditorHeight, CodeLanguage, FormElementType, NumberDefault, SliderDefault } from './constants';
import { FormElement } from './types';

/**
 * Capitalize First Letter
 */
export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Move Form Elements
 */
export const MoveFormElements = (elements: FormElement[], from: number, to: number) => {
  const element = elements[from];
  elements.splice(from, 1);
  elements.splice(to, 0, element);
};

/**
 * Set Element Defaults
 */
export const SetElementDefaults = (element: FormElement, newType: FormElementType): void => {
  switch (newType) {
    case FormElementType.SLIDER: {
      element.min = SliderDefault.min;
      element.max = SliderDefault.max;
      element.step = SliderDefault.step;
      element.value = SliderDefault.value;
      break;
    }
    case FormElementType.NUMBER: {
      element.min = NumberDefault.min;
      element.max = NumberDefault.max;
      break;
    }
    case FormElementType.CODE: {
      element.language = CodeLanguage.JAVASCRIPT;
      element.height = CodeEditorHeight;
      break;
    }
  }
};
