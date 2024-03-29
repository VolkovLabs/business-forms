import { SelectableValue } from '@grafana/data';
import { getAvailableIcons } from '@grafana/ui';

import { LinkTarget } from '../types';
import { TEST_IDS } from './tests';

/**
 * Form Element Type
 */
export const enum FormElementType {
  BOOLEAN = 'boolean',
  CODE = 'code',
  DATETIME = 'datetime',
  DISABLED = 'disabled',
  DISABLED_TEXTAREA = 'disabledTextarea',
  FILE = 'file',
  LINK = 'link',
  MULTISELECT = 'multiselect',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
  SECRET = 'secret',
  SELECT = 'select',
  SLIDER = 'slider',
  STRING = 'string',
  TEXTAREA = 'textarea',
  CHECKBOX_LIST = 'checkboxList',
}

/**
 * Form Element Type Options
 */
export const FORM_ELEMENT_TYPE_OPTIONS: SelectableValue[] = [
  {
    value: FormElementType.CODE,
    label: 'Code Editor',
  },
  {
    value: FormElementType.DATETIME,
    label: 'Date and Time',
  },
  {
    value: FormElementType.FILE,
    label: 'File',
  },
  {
    value: FormElementType.LINK,
    label: 'Link',
  },
  {
    value: FormElementType.MULTISELECT,
    label: 'Multi Select with Custom options',
  },
  {
    value: FormElementType.NUMBER,
    label: 'Number Input',
  },
  {
    value: FormElementType.SLIDER,
    label: 'Number Slider',
  },
  {
    value: FormElementType.PASSWORD,
    label: 'Password Input',
  },
  {
    value: FormElementType.BOOLEAN,
    label: 'Radio Group with Boolean options',
  },
  {
    value: FormElementType.RADIO,
    label: 'Radio Group with Custom options',
  },
  {
    value: FormElementType.DISABLED,
    label: 'Read-only',
  },
  {
    value: FormElementType.DISABLED_TEXTAREA,
    label: 'Read-only Text Area',
  },
  {
    value: FormElementType.SELECT,
    label: 'Select with Custom options',
  },
  {
    value: FormElementType.STRING,
    label: 'String Input',
  },
  {
    value: FormElementType.TEXTAREA,
    label: 'Text Area',
  },
  {
    value: FormElementType.CHECKBOX_LIST,
    label: 'Checkbox List with Custom options',
  },
];

/**
 * Boolean Element Options
 */
export const BOOLEAN_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElements.booleanOption('true'),
    value: true,
    label: 'True',
  },
  {
    ariaLabel: TEST_IDS.formElements.booleanOption('false'),
    value: false,
    label: 'False',
  },
];

/**
 * Select and Radio Type Options
 */
export const SELECT_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    value: FormElementType.NUMBER,
    label: 'Number',
  },
  {
    value: FormElementType.STRING,
    label: 'String',
  },
];

/**
 * Options to Hide String element
 */
export const STRING_ELEMENT_OPTIONS: SelectableValue[] = [
  {
    ariaLabel: TEST_IDS.formElementsEditor.radioOption('visibility-display'),
    description: 'Display',
    icon: 'eye',
    value: false,
  },
  {
    ariaLabel: TEST_IDS.formElementsEditor.radioOption('visibility-hidden'),
    description: 'Hidden',
    icon: 'eye-slash',
    value: true,
  },
];

/**
 * Auto Save timeout ms
 */
export const AUTO_SAVE_TIMEOUT = 1000;

/**
 * Loading Mode
 */
export enum LoadingMode {
  NONE = '',
  INITIAL = 'initial',
  UPDATE = 'update',
  RESET = 'reset',
}

/**
 * Icon Options
 */
export const ICON_OPTIONS = getAvailableIcons().map((name) => ({
  label: name,
  value: name,
  icon: name,
}));

/**
 * Options Source
 */
export enum OptionsSource {
  QUERY = 'Query',
  CUSTOM = 'Custom',
  CODE = 'Code',
}

/**
 * Options Source Options
 */
export const OPTIONS_SOURCE_OPTIONS = [
  {
    label: 'Query',
    value: OptionsSource.QUERY,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.QUERY),
  },
  {
    label: 'Custom',
    value: OptionsSource.CUSTOM,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.CUSTOM),
    icon: 'keyboard',
  },
  {
    label: 'Code',
    value: OptionsSource.CODE,
    ariaLabel: TEST_IDS.formElementsEditor.optionsSourceOption(OptionsSource.CODE),
    icon: 'calculator-alt',
  },
];

/**
 * Link Target Options
 */
export const LINK_TARGET_OPTIONS = [
  {
    label: 'Same Tab',
    value: LinkTarget.SELF_TAB,
    ariaLabel: TEST_IDS.formElementsEditor.linkTargetOption(LinkTarget.SELF_TAB),
  },
  {
    label: 'New Tab',
    value: LinkTarget.NEW_TAB,
    ariaLabel: TEST_IDS.formElementsEditor.linkTargetOption(LinkTarget.NEW_TAB),
    icon: 'external-link-alt',
  },
];
