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
    label: 'Basic',
  },
  {
    value: LayoutVariant.SPLIT,
    label: 'Sections',
  },
];
