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

    return getPayloadFn(elements, initial);
  }

  /**
   * Use deprecated property for backward compatability
   */
  const updatedOnly =
    request.payloadMode === undefined ? request.updatedOnly : request.payloadMode === PayloadMode.UPDATED;

  const body: any = {};
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
