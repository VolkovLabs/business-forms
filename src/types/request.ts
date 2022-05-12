import { ContentType, RequestMethod } from '../constants';
import { HeaderParameter } from './header-parameter';

/**
 * Request Options
 */
export interface RequestOptions {
  /**
   * Method
   *
   * @type {RequestMethod}
   */
  method: RequestMethod;

  /**
   * URL
   *
   * @type {string}
   */
  url: string;

  /**
   * Header Parameters
   *
   * @type {HeaderParameter[]}
   */
  header: HeaderParameter[];

  /**
   * Content-Type
   *
   * @type {string}
   */
  contentType: ContentType;

  /**
   * Custom COde
   *
   * @type {string}
   */
  code: string;
}
