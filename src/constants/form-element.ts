import { SelectableValue } from '@grafana/data';

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
  SLIDER = 'slider',
  STRING = 'string',
  TEXTAREA = 'textarea',
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
    value: true,
    label: 'True',
  },
  {
    value: false,
    label: 'False',
  },
];

/**
 * Select and Radio Type Options
 */
export const SelectElementOptions: SelectableValue[] = [
  {
    value: FormElementType.STRING,
    label: 'String',
  },
  {
    value: FormElementType.NUMBER,
    label: 'Number',
  },
];

/**
 * Options to Hide String element
 */
export const StringElementOptions: SelectableValue[] = [
  {
    description: 'Display',
    icon: 'eye',
    value: false,
  },
  {
    description: 'Hidden',
    icon: 'eye-slash',
    value: true,
  },
];
