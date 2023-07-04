import { SelectableValue } from '@grafana/data';
import { CodeDefault, FormElementType, NumberDefault, SliderDefault, TextareaDefault } from '../constants';
import { FormElement, FormElementBase, FormElementByType } from '../types';

/**
 * Move Form Elements
 */
export const MoveFormElements = <T extends unknown>(elements: T[], from: number, to: number): T[] => {
  /**
   * Clone array to prevent mutation
   */
  const result = [...elements];

  /**
   * Swap element on to position
   */
  const element = elements[from];
  result.splice(from, 1);
  result.splice(to, 0, element);

  return result;
};

/**
 * Get Element With New Type
 * @param element
 * @param newType
 */
export const GetElementWithNewType = (
  element: FormElement,
  newType: FormElementType
): FormElementByType<typeof newType> => {
  const baseValues: FormElementBase = {
    id: element.id,
    type: newType,
    labelWidth: element.labelWidth,
    width: element.width,
    value: element.value,
    title: element.title,
    tooltip: element.tooltip,
    section: element.section,
    unit: element.unit,
  };

  switch (newType) {
    case FormElementType.STRING: {
      return {
        ...baseValues,
        hidden: false,
        value: '',
        type: newType,
      };
    }
    case FormElementType.SLIDER: {
      return {
        ...baseValues,
        ...SliderDefault,
        type: newType,
      };
    }
    case FormElementType.NUMBER: {
      return {
        ...baseValues,
        ...NumberDefault,
        type: newType,
      };
    }
    case FormElementType.CODE: {
      return {
        ...baseValues,
        ...CodeDefault,
        type: newType,
      };
    }
    case FormElementType.TEXTAREA: {
      return {
        ...baseValues,
        ...TextareaDefault,
        type: newType,
      };
    }
    case FormElementType.SELECT:
    case FormElementType.DISABLED:
    case FormElementType.RADIO: {
      return {
        ...baseValues,
        options: 'options' in element ? element.options || [] : [],
        type: newType,
      };
    }
    default: {
      return {
        ...baseValues,
        type: newType,
      };
    }
  }
};

/**
 * Is Element Conflict
 * @param elements<FormElement[]>
 * @param element<FormElement>
 */
export const IsElementConflict = (elements: FormElement[], element: FormElement) => {
  return elements.some((item) => item.id === element.id && item.type === element.type);
};

/**
 * Is Element Option Conflict
 * @param options<SelectableValue[]>
 * @param option<SelectableValue>
 * @constructor
 */
export const IsElementOptionConflict = (options: SelectableValue[], option: SelectableValue) => {
  return options.some((item) => item.value === option.value);
};

/**
 * To Number Value
 * @param value
 * @constructor
 */
export const ToNumberValue = (value: string): number | null => {
  return value.trim().length > 0 ? Number(value) : null;
};

/**
 * Format Number Value
 * @param value
 * @constructor
 */
export const FormatNumberValue = (value: unknown): string | number => {
  return typeof value === 'number' ? value : '';
};

/**
 * Apply Width
 * @param value
 * @constructor
 */
export const ApplyWidth = (value: number | null): undefined | number => {
  return typeof value === 'number' ? value : undefined;
};
