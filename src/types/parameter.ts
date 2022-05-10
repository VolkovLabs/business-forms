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
}
