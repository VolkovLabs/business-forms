import { SelectableValue } from '@grafana/data';
import { TestIds } from './tests';
import { getAvailableIcons } from '@grafana/ui';

/**
 * Form Element Type
 */
export const enum FormElementType {
  BOOLEAN = 'boolean',
  CODE = 'code',
  DATETIME = 'datetime',
  DISABLED = 'disabled',
  NUMBER = 'number',
  PASSWORD = 'password',
  RADIO = 'radio',
  SECRET = 'secret',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  SLIDER = 'slider',
  STRING = 'string',
  TEXTAREA = 'textarea',
  FILE = 'file',
}

/**
 * Form Element Type Options
 */
export const FormElementTypeOptions: SelectableValue[] = [
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
];

/**
 * Boolean Element Options
 */
export const BooleanElementOptions: SelectableValue[] = [
  {
    ariaLabel: TestIds.formElements.booleanOption('true'),
    value: true,
    label: 'True',
  },
  {
    ariaLabel: TestIds.formElements.booleanOption('false'),
    value: false,
    label: 'False',
  },
];

/**
 * Select and Radio Type Options
 */
export const SelectElementOptions: SelectableValue[] = [
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
export const StringElementOptions: SelectableValue[] = [
  {
    ariaLabel: TestIds.formElementsEditor.radioOption('visibility-display'),
    description: 'Display',
    icon: 'eye',
    value: false,
  },
  {
    ariaLabel: TestIds.formElementsEditor.radioOption('visibility-hidden'),
    description: 'Hidden',
    icon: 'eye-slash',
    value: true,
  },
];

/**
 * Auto Save timeout ms
 */
export const AutoSaveTimeout = 1000;

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
export const IconOptions = getAvailableIcons().map((name) => ({
  label: name,
  value: name,
  icon: name,
}));
