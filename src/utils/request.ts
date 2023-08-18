import { InterpolateFunction } from '@grafana/data';
import { FormElementType, PayloadMode } from '../constants';
import { LocalFormElement, RequestOptions } from '../types';

/**
 * Get Payload For Request
 */
export const GetPayloadForRequest = ({
  request,
  elements,
  initial,
}: {
  request: RequestOptions;
  elements: LocalFormElement[];
  initial: Record<string, unknown>;
}) => {
  if (request.payloadMode === PayloadMode.CUSTOM) {
    /**
     * Get Payload Code Execution
     */
    const getPayloadFn = new Function('elements', 'initial', request.getPayload);

    return getPayloadFn(elements, initial) as unknown;
  }

  /**
   * Use deprecated property for backward compatibility
   */
  const updatedOnly =
    request.payloadMode === undefined ? request.updatedOnly : request.payloadMode === PayloadMode.UPDATED;

  /**
   * Payload
   */
  const body: Record<string, unknown> = {};

  /**
   * Get payload
   */
  elements.forEach((element) => {
    if (!updatedOnly) {
      body[element.id] = element.value;
      return;
    }

    /**
     * Skip not updated elements
     */
    if (element.value === initial[element.id]) {
      return;
    }

    /**
     * Skip Disabled elements
     */
    if (element.type === FormElementType.DISABLED) {
      return;
    }

    body[element.id] = element.value;
  });

  return body;
};

/**
 * File To Base64
 * @param file
 * @constructor
 */
const FileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result);
      }
    });

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

/**
 * To JSON
 */
export const ToJSON = async (payload: unknown, replaceVariables: InterpolateFunction): Promise<string> => {
  if (typeof payload !== 'object' || Array.isArray(payload) || payload === null) {
    return replaceVariables(JSON.stringify(payload));
  }

  const result: Record<string, unknown> = {};
  for (let [elementKey, elementValue] of Object.entries(payload)) {
    if (Array.isArray(elementValue) && elementValue[0] instanceof File) {
      /**
       * Read Files
       */
      result[elementKey] = await Promise.all(elementValue.map((file) => FileToBase64(file)));
    } else {
      result[elementKey] = elementValue;
    }
  }
  return replaceVariables(JSON.stringify(result));
};

/**
 * Get Form Data Value
 */
const GetFormDataValue = (value: unknown, replaceVariables: InterpolateFunction): string | Blob => {
  if (typeof value === 'string') {
    return replaceVariables(value);
  }
  if (value instanceof File) {
    return value;
  }
  return `${value}`;
};

/**
 * To Form Data
 */
export const ToFormData = (payload: Object, replaceVariables: InterpolateFunction): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([elementKey, elementValue]) => {
    if (Array.isArray(elementValue)) {
      elementValue.forEach((value, index) => {
        formData.set(`${elementKey}[${index}]`, GetFormDataValue(value, replaceVariables));
      });
      return;
    }
    formData.set(elementKey, GetFormDataValue(elementValue, replaceVariables));
  });

  return formData;
};
