import { LayoutOrientation, LayoutVariant } from '../constants';

/**
 * Layout Section
 */
export interface LayoutSection {
  /**
   * Name
   *
   * @type {string}
   */
  name: string;
}

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

  /**
   * Padding in pixels
   *
   * @type {number}
   */
  padding: number;

  /**
   * Orientation
   *
   * @type {LayoutOrientation}
   */
  orientation: LayoutOrientation;
}
