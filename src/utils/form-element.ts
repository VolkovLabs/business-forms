import { css } from '@emotion/css';
import { BusEventBase, dateTime, InterpolateFunction, PanelData, SelectableValue } from '@grafana/data';
import { ButtonVariant as GrafanaButtonVariant } from '@grafana/ui';
import { v4 as uuidv4 } from 'uuid';

import {
  CODE_DEFAULT,
  CUSTOM_BUTTON_DEFAULT,
  NUMBER_DEFAULT,
  OptionsSource,
  SELECT_DEFAULT,
  SLIDER_DEFAULT,
  TEXTAREA_DEFAULT,
} from '../constants';
import {
  ButtonVariant,
  ColorFormat,
  DisableIfHelper,
  FormElement,
  FormElementByType,
  FormElementType,
  GetOptionsHelper,
  LayoutSection,
  LinkTarget,
  LocalFormElement,
  ShowIfHelper,
} from '../types';
import { createExecutionCode } from './code';
import { disableIfCodeParameters, getOptionsCodeParameters, showIfCodeParameters } from './code-parameters';
import { getFieldValues } from './grafana';

/**
 * Reorder
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Get Date Time
 * @param value
 */
const getDateTimeValue = (value: string | number): string | undefined => {
  /**
   * Date format validation
   */
  return !isNaN(new Date(value).getTime()) ? new Date(value).toISOString() : undefined;
};

/**
 * Get Element With New Type
 * @param element
 * @param newType
 */
export const getElementWithNewType = (
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
    case FormElementType.COLOR_PICKER: {
      return {
        ...baseValues,
        hidden: false,
        colorFormat: ColorFormat.RGB,
        value: '',
        type: newType,
      };
    }
    case FormElementType.SLIDER: {
      return {
        ...baseValues,
        ...SLIDER_DEFAULT,
        type: newType,
      };
    }
    case FormElementType.NUMBER: {
      return {
        ...baseValues,
        ...NUMBER_DEFAULT,
        type: newType,
      };
    }
    case FormElementType.CODE: {
      return {
        ...baseValues,
        ...CODE_DEFAULT,
        type: newType,
      };
    }
    case FormElementType.TEXTAREA:
    case FormElementType.DISABLED_TEXTAREA: {
      return {
        ...baseValues,
        ...TEXTAREA_DEFAULT,
        type: newType,
      };
    }
    case FormElementType.SELECT:
    case FormElementType.MULTISELECT:
    case FormElementType.DISABLED:
    case FormElementType.RADIO:
    case FormElementType.CHECKBOX_LIST: {
      const selectOptions = {
        options: 'options' in element ? element.options || [] : [],
        optionsSource:
          'optionsSource' in element
            ? element.optionsSource || SELECT_DEFAULT.optionsSource
            : SELECT_DEFAULT.optionsSource,
        queryOptions: 'queryOptions' in element ? element.queryOptions : undefined,
      };

      /**
       * Pass value array to checkbox list
       */
      if (newType === FormElementType.CHECKBOX_LIST) {
        return {
          ...baseValues,
          ...selectOptions,
          allowCustomValue: false,
          type: newType,
          value: Array.isArray(baseValues) ? baseValues : [],
        };
      }

      return {
        ...baseValues,
        ...selectOptions,
        allowCustomValue: false,
        type: newType,
      };
    }
    case FormElementType.FILE: {
      return {
        ...baseValues,
        value: [],
        accept: '',
        type: newType,
        multiple: true,
      };
    }
    case FormElementType.DATETIME: {
      return {
        ...baseValues,
        value: '',
        type: newType,
        isUseLocalTime: false,
      };
    }
    case FormElementType.PASSWORD:
    case FormElementType.SECRET: {
      return {
        ...baseValues,
        value: '',
        type: newType,
      };
    }
    case FormElementType.TIME:
    case FormElementType.DATE: {
      return {
        ...baseValues,
        value: '',
        type: newType,
      };
    }
    case FormElementType.BOOLEAN: {
      return {
        ...baseValues,
        value: false,
        type: newType,
      };
    }
    case FormElementType.BUTTON: {
      return {
        ...baseValues,
        ...CUSTOM_BUTTON_DEFAULT,
        value: '',
        type: newType,
      };
    }
    case FormElementType.LINK: {
      return {
        ...baseValues,
        value: '',
        target: LinkTarget.SELF_TAB,
        linkText: '',
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
export const isElementConflict = (elements: FormElement[], element: FormElement) => {
  return elements.some((item) => item.id === element.id && item.type === element.type);
};

/**
 * Is Element Option Conflict
 * @params options<SelectableValue[]>
 * @params option<SelectableValue>
 * @constructor
 */
export const isElementOptionConflict = (options: SelectableValue[], option: SelectableValue) => {
  return options.some((item) => item.value.toString() === option.value.toString());
};

/**
 * To Number Value
 * @param value
 * @constructor
 */
export const toNumberValue = (value: string): number | null => {
  return value.trim().length > 0 ? Number(value) : null;
};

/**
 * Format Number Value
 * @param value
 * @constructor
 */
export const formatNumberValue = (value: unknown): string | number => {
  return typeof value === 'number' ? value : '';
};

/**
 * Apply Width
 * @param value
 * @constructor
 */
export const applyWidth = (value: number | null): undefined | number => {
  return typeof value === 'number' ? value : undefined;
};

/**
 * Get Element Unique Id
 */
export const getElementUniqueId = (element: FormElement) => element.uid || uuidv4();

/**
 * Get Option Unique Id
 */
export const getOptionUniqueId = (option: SelectableValue) => (option.id !== undefined ? option.id : option.value);

/**
 * Is Section Collision Exists
 */
export const isSectionCollisionExists = (sections: LayoutSection[], compareWith: LayoutSection) => {
  return sections.some((section) => section.id === compareWith.id);
};

/**
 * To Local Form Element
 */
export const toLocalFormElement = (element: FormElement, replaceVariables?: InterpolateFunction): LocalFormElement => {
  const showIf = element.showIf;
  let showIfFn: ShowIfHelper = () => true;
  if (showIf || showIf?.trim()) {
    showIfFn = ({ elements }: { elements: FormElement[] }) => {
      const fn = createExecutionCode('context', replaceVariables ? replaceVariables(showIf) : showIf);
      return fn(
        showIfCodeParameters.create({
          panel: {
            elements,
          },
        })
      );
    };
  }

  const disableIf = element.disableIf;

  let disableIfFn: DisableIfHelper = () => false;
  if (disableIf || disableIf?.trim()) {
    disableIfFn = ({ elements }: { elements: FormElement[] }) => {
      const fn = createExecutionCode('context', replaceVariables ? replaceVariables(disableIf) : disableIf);
      return fn(
        disableIfCodeParameters.create({
          panel: {
            elements,
          },
        })
      );
    };
  }

  let getOptions: GetOptionsHelper = () => [];
  if (
    element.type === FormElementType.DISABLED ||
    element.type === FormElementType.SELECT ||
    element.type === FormElementType.MULTISELECT ||
    element.type === FormElementType.RADIO ||
    element.type === FormElementType.CHECKBOX_LIST
  ) {
    if (element.optionsSource === OptionsSource.QUERY) {
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

        const labelValues = getFieldValues(
          frame?.fields.find((field) => field.name === queryOptions.label) || valueField
        );

        return getFieldValues(valueField).map((value, index) => ({
          value,
          label: labelValues[index] as string,
        }));
      };
    } else if (element.optionsSource === OptionsSource.CODE) {
      getOptions = ({ data, elements }: { data: PanelData; elements: FormElement[] }) => {
        const options = element.getOptions
          ? replaceVariables
            ? replaceVariables(element.getOptions)
            : element.getOptions
          : 'return []';

        const fn = createExecutionCode('context', options);
        return fn(
          getOptionsCodeParameters.create({
            panel: {
              data,
              elements,
            },
          })
        );
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
            id: getOptionUniqueId(option),
          })),
        }
      : {}),
    helpers: {
      showIf: showIfFn,
      disableIf: disableIfFn,
      getOptions,
    },
    uid: getElementUniqueId(element),
  };
};

/**
 * Normalize Elements for Local State
 */
export const normalizeElementsForLocalState = (
  elements?: FormElement[],
  replaceVariables?: InterpolateFunction
): LocalFormElement[] => {
  if (elements && Array.isArray(elements)) {
    return elements.map<LocalFormElement>((element) => toLocalFormElement(element, replaceVariables));
  }

  return [];
};

/**
 * Normalize Elements for Dashboard
 */
export const normalizeElementsForDashboard = (elements: LocalFormElement[]): FormElement[] => {
  return elements.map<FormElement>(({ helpers, ...restElement }) => {
    return restElement;
  });
};

/**
 * Get Initial Values Map
 * @param elements
 * @constructor
 */
export const getInitialValuesMap = (elements: LocalFormElement[]): Record<string, unknown> => {
  return elements.reduce(
    (acc, element) => ({
      ...acc,
      [element.id]: element.value,
    }),
    {}
  );
};

/**
 * Get Button Variant
 */
export const getButtonVariant = (variant: ButtonVariant): GrafanaButtonVariant | undefined => {
  switch (variant) {
    case ButtonVariant.DESTRUCTIVE:
    case ButtonVariant.PRIMARY:
    case ButtonVariant.SECONDARY: {
      return variant;
    }

    default: {
      return;
    }
  }
};

/**
 * Is Form Element Type
 */
export const isFormElementType = <T extends FormElementType>(
  element: LocalFormElement,
  type: T
): element is LocalFormElement & { type: T } => {
  return element.type === type;
};

/**
 * Convert To Element Value
 */
export const convertToElementValue = (
  element: LocalFormElement,
  value: unknown
): FormElementByType<LocalFormElement, typeof element.type> => {
  switch (element.type) {
    case FormElementType.CODE:
    case FormElementType.TEXTAREA: {
      return {
        ...element,
        value: typeof value === 'string' ? value.replaceAll('\n', '\\n') : (value?.toString() ?? ''),
      };
    }
    case FormElementType.STRING:
    case FormElementType.DISABLED_TEXTAREA:
    case FormElementType.PASSWORD:
    case FormElementType.SECRET:
    case FormElementType.COLOR_PICKER:
    case FormElementType.TEXTAREA:
    case FormElementType.BUTTON:
    case FormElementType.LINK: {
      return {
        ...element,
        value: typeof value === 'string' ? value : (value?.toString() ?? ''),
      };
    }
    case FormElementType.NUMBER:
    case FormElementType.SLIDER: {
      let newValue = typeof value === 'number' ? value : 0;

      if (typeof value === 'string') {
        newValue = Number(value);

        if (Number.isNaN(newValue)) {
          newValue = 0;
        }
      }
      return {
        ...element,
        value: newValue,
      };
    }
    case FormElementType.FILE: {
      return {
        ...element,
        value: [],
      };
    }
    case FormElementType.BOOLEAN: {
      return {
        ...element,
        value: !!value,
      };
    }
    case FormElementType.DATETIME:
    case FormElementType.TIME:
    case FormElementType.DATE: {
      let newValue;
      if (typeof value === 'number' || typeof value === 'string') {
        newValue = getDateTimeValue(value);
      }

      return {
        ...element,
        value: newValue,
      };
    }

    case FormElementType.CHECKBOX_LIST: {
      return {
        ...element,
        value: Array.isArray(value) ? value : [value],
      };
    }
    default: {
      return {
        ...element,
        value,
      };
    }
  }
};

/**
 * Value Changed Event
 */
export class ValueChangedEvent extends BusEventBase {
  static type = 'value-changed';
  payload: { elements: LocalFormElement[]; element: LocalFormElement };

  constructor(payload: { elements: LocalFormElement[]; element: LocalFormElement }) {
    super();
    this.payload = payload;
  }
}

/**
 * Apply Accepted Files
 */
export const applyAcceptedFiles = (acceptFiles: string) => {
  if (!acceptFiles) {
    return undefined;
  }

  /**
   * acceptFiles Convert to array
   */
  const filesArray = acceptFiles.split(',');

  /**
   * Convert to [key: string]: string[] view according to "Accept" type
   */
  return filesArray.reduce(
    (acc, value) => {
      const trimmedValue = value.trim();
      const extension = trimmedValue.substring(1);

      if (acc.hasOwnProperty(extension)) {
        acc[extension] = [...acc[extension], trimmedValue];
      } else {
        acc[extension] = [trimmedValue];
      }

      return acc;
    },
    {} as Record<string, string[]>
  );
};

/**
 * Format Element Value
 */
export const formatElementValue = (element: LocalFormElement, value: unknown): string => {
  switch (element.type) {
    case FormElementType.PASSWORD: {
      return '*********';
    }
    case FormElementType.DATETIME: {
      return value && typeof value === 'string' ? dateTime(value).toISOString(element.isUseLocalTime) : '';
    }
    case FormElementType.TIME: {
      return value && typeof value === 'string'
        ? new Date(value).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        : '';
    }
    case FormElementType.TEXTAREA:
    case FormElementType.CODE: {
      return value && typeof value === 'string' ? value.replaceAll('\\n', '\n') : '';
    }
    default: {
      return value === undefined ? '' : String(value);
    }
  }
};

/**
 * Apply Label styles
 * @param labelBackground
 * @param labelColor
 */
export const applyLabelStyles = (labelBackground?: string, labelColor?: string): string => {
  return css`
    ${labelBackground &&
    `
      & label:first-child {
          background: ${labelBackground};
        }
    `}
    ${labelColor &&
    `
      & label:first-child {
          color: ${labelColor};
        } 
    `}
  `;
};

/**
 * Patch Form Value
 * @param elements
 * @param objectValues
 */
export const patchFormValueHandler = (elements: LocalFormElement[], objectValues: Record<string, unknown>) => {
  return elements.map((item) => {
    const newValue = objectValues[item.id];

    /**
     * Set Value
     */
    if (newValue !== null && newValue !== undefined) {
      item.value = convertToElementValue(item, newValue).value;
    }

    return item;
  });
};

/**
 * Convert Elements To Payload
 * @param elements
 */
export const convertElementsToPayload = (elements: LocalFormElement[]) =>
  elements.reduce<Record<string, unknown>>((acc, element) => {
    acc[element.id] = element.value;
    return acc;
  }, {});

/**
 * Set Form Value
 * @param elements
 * @param initialElements
 * @param objectValues
 */
export const setFormValueHandler = (
  elements: LocalFormElement[],
  initialElements: LocalFormElement[],
  objectValues: Record<string, unknown>
) => {
  return elements.map((item) => {
    const newValue = objectValues[item.id];

    /**
     * Set Value
     */
    if (newValue !== null && newValue !== undefined) {
      item.value = convertToElementValue(item, newValue).value;
    } else {
      /**
       * Set Initial value or reset to empty value
       */
      const initialElement = initialElements.find((initialElement) => initialElement.id === item.id);
      item.value =
        initialElement?.value !== undefined && initialElement?.value !== null
          ? convertToElementValue(item, initialElement.value).value
          : convertToElementValue(item, '').value;
    }

    return item;
  });
};
