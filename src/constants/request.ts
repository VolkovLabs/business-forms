import { SelectableValue } from '@grafana/data';
import { CapitalizeFirstLetter } from './button';

/**
 * Request Methods
 */
export const enum RequestMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  NONE = '-',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

/**
 * Initial Request Method
 */
export const RequestMethodInitialOptions: SelectableValue[] = [
  {
    value: RequestMethod.NONE,
    label: RequestMethod.NONE,
  },
  {
    value: RequestMethod.GET,
    label: RequestMethod.GET,
  },
];

/**
 * Update Request Method
 */
export const RequestMethodUpdateOptions: SelectableValue[] = [
  {
    value: RequestMethod.NONE,
    label: RequestMethod.NONE,
  },
  {
    value: RequestMethod.DELETE,
    label: RequestMethod.DELETE,
  },
  {
    value: RequestMethod.PATCH,
    label: RequestMethod.PATCH,
  },
  {
    value: RequestMethod.POST,
    label: RequestMethod.POST,
  },
  {
    value: RequestMethod.PUT,
    label: RequestMethod.PUT,
  },
];

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
