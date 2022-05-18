import { SelectableValue } from '@grafana/data';
import { InputParameterType } from '../constants';

/**
 * Input Parameter
 */
export interface InputParameter {
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
   * @type {InputParameterType}
   */
  type: InputParameterType;

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
   * Label Width
   *
   * @type {number}
   */
  labelWidth: number;

  /**
   * Tooltip
   *
   * @type {string}
   */
  tooltip: string;
}
