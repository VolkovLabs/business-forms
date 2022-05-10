import { SelectableValue } from '@grafana/data';
import { CapitalizeFirstLetter } from '../utils';

/**
 * Request Methods
 */
export const enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

/**
 * Request Method GET
 */
export const RequestMethodGetOptions: SelectableValue[] = [
  {
    value: RequestMethod.GET,
    label: RequestMethod.GET,
  },
];

/**
 * Request Method POST
 */
export const RequestMethodPostOptions: SelectableValue[] = [
  {
    value: RequestMethod.POST,
    label: RequestMethod.POST,
  },
  {
    value: RequestMethod.PUT,
    label: RequestMethod.PUT,
  },
  {
    value: RequestMethod.PATCH,
    label: RequestMethod.PATCH,
  },
];

/**
 * Request Method Options
 */
export const RequestMethodOptions: SelectableValue[] = [...RequestMethodGetOptions, ...RequestMethodPostOptions];

/**
 * Content Types
 */
export const enum ContentType {
  JSON = 'application/json',
  PLAIN = 'text/plain',
}

/**
 * Content Type Options
 */
export const ContentTypeOptions: SelectableValue[] = [
  { label: CapitalizeFirstLetter(ContentType.JSON), value: ContentType.JSON },
  { label: CapitalizeFirstLetter(ContentType.PLAIN), value: ContentType.PLAIN },
];
