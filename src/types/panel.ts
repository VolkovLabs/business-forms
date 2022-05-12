import { ButtonGroupOptions, ButtonOptions } from './button';
import { InputParameter } from './input-parameter';
import { LayoutOptions } from './layout';
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
   * Button Group
   *
   * @type {ButtonGroupOptions}
   */
  buttonGroup: ButtonGroupOptions;

  /**
   * Submit Button
   *
   * @type {ButtonOptions}
   */
  submit: ButtonOptions;

  /**
   * Reset Button
   *
   * @type {ButtonOptions}
   */
  reset: ButtonOptions;

  /**
   * Input Parameters
   *
   * @type {InputParameter[]}
   */
  parameters: InputParameter[];

  /**
   * Layout
   *
   * @type {LayoutOptions}
   */
  layout: LayoutOptions;
}
