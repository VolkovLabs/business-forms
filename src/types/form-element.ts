import { SelectableValue } from '@grafana/data';
import { FormElementType } from '../constants';

/**
 * Form Element
 */
export interface FormElement {
  /**
   * Id
   *
   * @type {string}
   */
  id: string;

  /**
   * Title
   *
   * @type {string}
   */
  title: string;

  /**
   * Type
   *
   * @type {FormElementType}
   */
  type: FormElementType;

  /**
   * Value
   *
   * @type {any}
   */
  value?: any;

  /**
   * Unit
   *
   * @type {string}
   */
  unit?: string;

  /**
   * Options
   *
   * @type {SelectableValue[]}
   */
  options?: SelectableValue[];

  /**
   * Maximum Value
   *
   * @type {number}
   */
  max?: number;

  /**
   * Minimum Value
   *
   * @type {number}
   */
  min?: number;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Rows
   *
   * @type {number}
   */
  rows?: number;

  /**
   * Height
   *
   * @type {number}
   */
  height?: number;

  /**
   * Label Width
   *
   * @type {number}
   */
  labelWidth: number;

  /**
   * Width
   *
   * @type {number}
   */
  width?: number;

  /**
   * Tooltip
   *
   * @type {string}
   */
  tooltip: string;

  /**
   * Section's Name
   *
   * @type {string}
   */
  section: string;

  /**
   * Language
   *
   * @type {string}
   */
  language?: string;
}
