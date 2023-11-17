import { InterpolateFunction, SelectableValue } from '@grafana/data';
import { v4 as uuidv4 } from 'uuid';

import {
  CodeDefault,
  FormElementType,
  NumberDefault,
  OptionsSource,
  SelectDefaults,
  SliderDefault,
  TextareaDefault,
} from '../constants';
import {
  FormElement,
  FormElementByType,
  GetOptionsHelper,
  LayoutSection,
  LocalFormElement,
  ShowIfHelper,
} from '../types';
import { GetFieldValues } from './grafana';

/**
 * Reorder
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const Reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Get Element With New Type
 * @param element
 * @param newType
 */
export const GetElementWithNewType = (
  element: LocalFormElement,
  newType: FormElementType
): FormElementByType<LocalFormElement, typeof newType> => {
  const baseValues = {
    uid: element.uid,
    id: element.id,
    type: newType,
    labelWidth: element.labelWidth,
    width: element.width,
    value: element.value,
    title: element.title,
    tooltip: element.tooltip,
    section: element.section,
    unit: element.unit,
    helpers: element.helpers,
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
    case FormElementType.TEXTAREA:
    case FormElementType.DISABLED_TEXTAREA: {
      return {
        ...baseValues,
        ...TextareaDefault,
        type: newType,
      };
    }
    case FormElementType.SELECT:
    case FormElementType.MULTISELECT:
    case FormElementType.DISABLED:
    case FormElementType.RADIO: {
      return {
        ...baseValues,
        options: 'options' in element ? element.options || [] : [],
        optionsSource:
          'optionsSource' in element
            ? element.optionsSource || SelectDefaults.optionsSource
            : SelectDefaults.optionsSource,
        queryOptions: 'queryOptions' in element ? element.queryOptions : undefined,
        type: newType,
      };
    }
    case FormElementType.FILE: {
      return {
        ...baseValues,
        accept: '',
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
 * @params elements<FormElement[]>
 * @params element<FormElement>
 */
export const IsElementConflict = (elements: FormElement[], element: FormElement) => {
  return elements.some((item) => item.id === element.id && item.type === element.type);
};

/**
 * Is Element Option Conflict
 * @params options<SelectableValue[]>
 * @params option<SelectableValue>
 * @constructor
 */
export const IsElementOptionConflict = (options: SelectableValue[], option: SelectableValue) => {
  return options.some((item) => item.value.toString() === option.value.toString());
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

/**
 * Get Element Unique Id
 */
export const GetElementUniqueId = (element: FormElement) => element.uid || uuidv4();

/**
 * Get Layout Unique Id
 */
export const GetLayoutUniqueId = (section: LayoutSection) => (section.id !== undefined ? section.id : section.name);

/**
 * Get Option Unique Id
 */
export const GetOptionUniqueId = (option: SelectableValue) => (option.id !== undefined ? option.id : option.value);

/**
 * Is Section Collision Exists
 */
export const IsSectionCollisionExists = (sections: LayoutSection[], compareWith: LayoutSection) => {
  return sections.some((section) => section.id === compareWith.id);
};

/**
 * To Local Form Element
 */
export const ToLocalFormElement = (element: FormElement): LocalFormElement => {
  const showIf = element.showIf;

  let showIfFn: ShowIfHelper = () => true;
  if (showIf || showIf?.trim()) {
    const fn = new Function('elements', 'replaceVariables', showIf);
    showIfFn = ({ elements, replaceVariables }: { elements: FormElement[]; replaceVariables: InterpolateFunction }) =>
      fn(elements, replaceVariables);
  }

  let getOptions: GetOptionsHelper = () => [];
  if (
    element.type === FormElementType.DISABLED ||
    element.type === FormElementType.SELECT ||
    element.type === FormElementType.MULTISELECT ||
    element.type === FormElementType.RADIO
  ) {
    if (element.optionsSource === OptionsSource.Query) {
      getOptions = ({ data }) => {
        const { queryOptions } = element;

        if (!queryOptions || !queryOptions.value) {
          return [];
        }

        const frame = data.series.find((frame) => frame.refId === queryOptions.source);
        const valueField = frame?.fields.find((field) => field.name === queryOptions.value);

        if (!frame || !valueField) {
          return [];
        }

        const labelValues = GetFieldValues(
          frame?.fields.find((field) => field.name === queryOptions.label) || valueField
        );

        return GetFieldValues(valueField).map((value, index) => ({
          value,
          label: labelValues[index] as string,
        }));
      };
    } else {
      getOptions = () => element.options || [];
    }
  }

  return {
    ...element,
    ...('options' in element
      ? {
          options: element.options?.map((option) => ({
            ...option,
            id: GetOptionUniqueId(option),
          })),
        }
      : {}),
    helpers: {
      showIf: showIfFn,
      getOptions,
    },
    uid: GetElementUniqueId(element),
  };
};

/**
 * Normalize Elements for Local State
 */
export const NormalizeElementsForLocalState = (elements?: FormElement[]): LocalFormElement[] => {
  if (elements && Array.isArray(elements)) {
    return elements.map<LocalFormElement>((element) => ToLocalFormElement(element));
  }

  return [];
};

/**
 * Normalize Elements for Dashboard
 */
export const NormalizeElementsForDashboard = (elements: LocalFormElement[]): FormElement[] => {
  return elements.map<FormElement>(({ helpers, ...restElement }) => {
    return restElement;
  });
};

/**
 * Get Initial Values Map
 * @param elements
 * @constructor
 */
export const GetInitialValuesMap = (elements: LocalFormElement[]): Record<string, unknown> => {
  return elements.reduce(
    (acc, element) => ({
      ...acc,
      [element.id]: element.value,
    }),
    {}
  );
};
