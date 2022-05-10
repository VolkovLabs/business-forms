import { IconName } from '@grafana/ui';
import { ButtonOrientation, ButtonSize, ButtonVariant } from '../constants';

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
   * Size
   *
   * @type {ButtonSize}
   */
  size: ButtonSize;

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
