import { SelectableValue } from '@grafana/data';
import { CapitalizeFirstLetter } from '../constant-utils';

/**
 * Button Variants
 */
export const enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DESTRUCTIVE = 'destructive',
  CUSTOM = 'custom',
  HIDDEN = 'hidden',
}

/**
 * Button Variant Hidden
 */
export const ButtonVariantHiddenOption: SelectableValue[] = [
  {
    value: ButtonVariant.HIDDEN,
    label: CapitalizeFirstLetter(ButtonVariant.HIDDEN),
  },
];

/**
 * Button Variant
 */
export const ButtonVariantOptions: SelectableValue[] = [
  {
    value: ButtonVariant.PRIMARY,
    label: CapitalizeFirstLetter(ButtonVariant.PRIMARY),
  },
  {
    value: ButtonVariant.SECONDARY,
    label: CapitalizeFirstLetter(ButtonVariant.SECONDARY),
  },
  {
    value: ButtonVariant.DESTRUCTIVE,
    label: CapitalizeFirstLetter(ButtonVariant.DESTRUCTIVE),
  },
  {
    value: ButtonVariant.CUSTOM,
    label: CapitalizeFirstLetter(ButtonVariant.CUSTOM),
  },
];

/**
 * Button Orientations
 */
export const enum ButtonOrientation {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

/**
 * Button Orientation Options
 */
export const ButtonOrientationOptions: SelectableValue[] = [
  {
    value: ButtonOrientation.LEFT,
    label: CapitalizeFirstLetter(ButtonOrientation.LEFT),
  },
  {
    value: ButtonOrientation.CENTER,
    label: CapitalizeFirstLetter(ButtonOrientation.CENTER),
  },
  {
    value: ButtonOrientation.RIGHT,
    label: CapitalizeFirstLetter(ButtonOrientation.RIGHT),
  },
];

/**
 * Button Size
 */
export const enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

/**
 * Button Size Options
 */
export const ButtonSizeOptions: SelectableValue[] = [
  {
    value: ButtonSize.SMALL,
    label: 'Small',
  },
  {
    value: ButtonSize.MEDIUM,
    label: 'Medium',
  },
  {
    value: ButtonSize.LARGE,
    label: 'Large',
  },
];
