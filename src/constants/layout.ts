import { SelectableValue } from '@grafana/data';

/**
 * Layout Variants
 */
export const enum LayoutVariant {
  NONE = 'none',
  SINGLE = 'single',
  SPLIT = 'split',
}

/**
 * Layout Variant Options
 */
export const LayoutVariantOptions: SelectableValue[] = [
  {
    value: LayoutVariant.SINGLE,
    description: 'All elements together.',
    label: 'Basic',
  },
  {
    value: LayoutVariant.NONE,
    description: 'Buttons only.',
    label: 'Buttons only',
  },
  {
    value: LayoutVariant.SPLIT,
    description: 'Elements split in separate sections.',
    label: 'Sections',
  },
];
