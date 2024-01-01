import { SelectableValue } from '@grafana/data';

import { ButtonOrientation, ButtonSize, ButtonVariant } from '../types';

/**
 * Button Variant Hidden
 */
export const BUTTON_VARIANT_HIDDEN_OPTIONS: SelectableValue[] = [
  {
    value: ButtonVariant.HIDDEN,
    label: 'Hidden',
  },
];

/**
 * Button Variant
 */
export const BUTTON_VARIANT_OPTIONS: SelectableValue[] = [
  {
    value: ButtonVariant.PRIMARY,
    label: 'Primary',
  },
  {
    value: ButtonVariant.SECONDARY,
    label: 'Secondary',
  },
  {
    value: ButtonVariant.DESTRUCTIVE,
    label: 'Destructive',
  },
  {
    value: ButtonVariant.CUSTOM,
    label: 'Custom',
  },
];

/**
 * Button Orientation Options
 */
export const BUTTON_ORIENTATION_OPTIONS: SelectableValue[] = [
  {
    value: ButtonOrientation.LEFT,
    label: 'Left',
    icon: 'horizontal-align-left',
  },
  {
    value: ButtonOrientation.CENTER,
    label: 'Center',
    icon: 'horizontal-align-center',
  },
  {
    value: ButtonOrientation.RIGHT,
    label: 'Right',
    icon: 'horizontal-align-right',
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
