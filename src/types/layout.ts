import { LayoutVariant } from '../constants';

/**
 * Layout Options
 */
export interface LayoutOptions {
  /**
   * Variant
   *
   * @type {LayoutVariant}
   */
  variant: LayoutVariant;

  /**
   * Text on Left
   *
   * @type {string}
   */
  textLeft: string;

  /**
   * Text on Right
   *
   * @type {string}
   */
  textRight: string;
}
