import { CapitalizeFirstLetter } from '../utils';

/**
 * Request Methods
 */
export const enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
}

/**
 * Request Method GET
 */
export const RequestMethodGetOptions = [
  {
    value: RequestMethod.GET,
    label: RequestMethod.GET,
  },
];

/**
 * Request Method POST
 */
export const RequestMethodPostOptions = [
  {
    value: RequestMethod.POST,
    label: RequestMethod.POST,
  },
];

/**
 * Request Method Options
 */
export const RequestMethodOptions = [...RequestMethodGetOptions, ...RequestMethodPostOptions];

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
export const ContentTypeOptions = [
  { label: CapitalizeFirstLetter(ContentType.JSON), value: ContentType.JSON },
  { label: CapitalizeFirstLetter(ContentType.PLAIN), value: ContentType.PLAIN },
];
