import { IconName } from '@grafana/ui';

import { ButtonOrientation, ButtonSize, ButtonVariant } from '../constants';

/**
 * Button Group Options
 */
export interface ButtonGroupOptions {
  /**
   * Orientation
   *
   * @type {ButtonOrientation}
   */
  orientation: ButtonOrientation;

  /**
   * Size
   *
   * @type {ButtonSize}
   */
  size: ButtonSize;
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
