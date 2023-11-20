import { SelectableValue } from '@grafana/data';

import { ButtonOrientation, ButtonSize, ButtonVariant } from '../types';

/**
 * Capitalize First Letter
 */
export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
