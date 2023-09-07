import { ButtonGroupOptions, ButtonOptions } from './button';
import { FormElement } from './form-element';
import { LayoutOptions } from './layout';
import { RequestOptions, ResetAction } from './request';
import { ModalOptions } from './modal';

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
   * Reset Action
   *
   * @type {ResetAction}
   */
  resetAction: ResetAction;

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
   * Save Default Button
   *
   * @type {Pick<ButtonOptions, 'variant' | 'text' | 'icon'>}
   */
  saveDefault: Pick<ButtonOptions, 'variant' | 'text' | 'icon'>;

  /**
   * Form Elements
   *
   * @type {FormElement[]}
   */
  elements: FormElement[];

  /**
   * Layout
   *
   * @type {LayoutOptions}
   */
  layout: LayoutOptions;

  /**
   * Confirm Modal
   *
   * @type {ModalOptions}
   */
  confirmModal: ModalOptions;
}
