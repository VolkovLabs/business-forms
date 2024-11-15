import { LayoutOrientation, LayoutVariant, SectionVariant } from '@/constants';
import { LocalFormElement } from '@/types/form-element';

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

  /**
   * ID
   *
   * @type {string}
   */
  id: string;

  /**
   * Expanded
   *
   * @type {string}
   */
  expanded?: boolean;
}

/**
 * Layout Section With Elements
 */
export type LayoutSectionWithElements = LayoutSection & { elements: LocalFormElement[] };

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

  /**
   * Section Variant
   *
   * @type {SectionVariant}
   */
  sectionVariant: SectionVariant;
}
