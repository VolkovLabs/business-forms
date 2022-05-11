import { SelectableValue } from '@grafana/data';

/**
 * Layout Variants
 */
export const enum LayoutVariant {
  SINGLE = 'single',
  SPLIT = 'split',
}

/**
 * Layout Variant Options
 */
export const LayoutVariantOptions: SelectableValue[] = [
  {
    value: LayoutVariant.SINGLE,
    label: 'Single',
  },
  {
    value: LayoutVariant.SPLIT,
    label: 'Split Disabled',
  },
];
