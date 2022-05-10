import { ButtonOptions } from './button';
import { InputParameter } from './parameter';
import { RequestOptions } from './request';

/**
 * Panel Options
 */
export interface PanelOptions {
  /**
   * Initial Values
   *
   * @type {RequestOptions}
   */
  initial: RequestOptions;

  /**
   * Update Values
   *
   * @type {RequestOptions}
   */
  update: RequestOptions;

  /**
   * Submit Button
   *
   * @type {ButtonOptions}
   */
  submit: ButtonOptions;

  /**
   * Input Parameters
   *
   * @type {InputParameter[]}
   */
  parameters: InputParameter[];
}
