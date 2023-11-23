import { SelectableValue } from '@grafana/data';

import { ButtonOrientation, ButtonSize, ButtonVariant } from '../types';
import { capitalizeFirstLetter } from '../utils';

/**
 * Button Variant Hidden
 */
export const BUTTON_VARIANT_HIDDEN_OPTIONS: SelectableValue[] = [
  {
    value: ButtonVariant.HIDDEN,
    label: capitalizeFirstLetter(ButtonVariant.HIDDEN),
  },
];

/**
 * Button Variant
 */
export const BUTTON_VARIANT_OPTIONS: SelectableValue[] = [
  {
    value: ButtonVariant.PRIMARY,
    label: capitalizeFirstLetter(ButtonVariant.PRIMARY),
  },
  {
    value: ButtonVariant.SECONDARY,
    label: capitalizeFirstLetter(ButtonVariant.SECONDARY),
  },
  {
    value: ButtonVariant.DESTRUCTIVE,
    label: capitalizeFirstLetter(ButtonVariant.DESTRUCTIVE),
  },
  {
    value: ButtonVariant.CUSTOM,
    label: capitalizeFirstLetter(ButtonVariant.CUSTOM),
  },
];

/**
 * Button Orientation Options
 */
export const BUTTON_ORIENTATION_OPTIONS: SelectableValue[] = [
  {
    value: ButtonOrientation.LEFT,
    label: capitalizeFirstLetter(ButtonOrientation.LEFT),
  },
  {
    value: ButtonOrientation.CENTER,
    label: capitalizeFirstLetter(ButtonOrientation.CENTER),
  },
  {
    value: ButtonOrientation.RIGHT,
    label: capitalizeFirstLetter(ButtonOrientation.RIGHT),
  },
];

/**
 * Button Size Options
 */
export const BUTTON_SIZE_OPTIONS: SelectableValue[] = [
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
