import { LayoutVariant } from '../constants';
import { LayoutSection } from './layout-section';

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
   * Sections
   *
   * @type {LayoutSection}
   */
  sections: LayoutSection[];
}
