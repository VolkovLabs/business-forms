import { IconName } from '@grafana/ui';
import { ButtonOrientation, ButtonVariant, ContentType, InputParameterType, RequestMethod } from './constants';

/**
 * Options
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

/**
 * Request Options
 */
export interface RequestOptions {
  /**
   * Method
   *
   * @type {RequestMethod}
   */
  method: RequestMethod;

  /**
   * URL
   *
   * @type {string}
   */
  url: string;

  /**
   * Content-Type
   *
   * @type {string}
   */
  contentType: ContentType;
}

/**
 * Button Options
 */
export interface ButtonOptions {
  /**
   * Variant
   *
   * @type {ButtonVariant}
   */
  variant: ButtonVariant;

  /**
   * Text
   *
   * @type {string}
   */
  text: string;

  /**
   * Orientation
   *
   * @type {ButtonOrientation}
   */
  orientation: ButtonOrientation;

  /**
   * Icon
   *
   * @type {IconName}
   */
  icon: IconName;

  /**
   * Foreground Color
   *
   * @type {string}
   */
  foregroundColor: string;

  /**
   * Background Color
   *
   * @type {string}
   */
  backgroundColor: string;
}

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
   * Type
   *
   * @type {InputParameterType}
   */
  type: InputParameterType;
}
