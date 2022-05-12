import { SelectableValue } from '@grafana/data';

/**
 * Input Parameter Type
 */
export const enum InputParameterType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  RADIO = 'radio',
  SLIDER = 'slider',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  SECRET = 'secret',
  DATETIME = 'datetime',
  DISABLED = 'disabled',
  PASSWORD = 'password',
}

/**
 * Input Parameter Type Options
 */
export const InputParameterTypeOptions: SelectableValue[] = [
  {
    value: InputParameterType.DATETIME,
    label: 'Date and Time Input',
  },
  {
    value: InputParameterType.DISABLED,
    label: 'Disabled Input',
  },
  {
    value: InputParameterType.NUMBER,
    label: 'Number Input',
  },
  {
    value: InputParameterType.SLIDER,
    label: 'Number Slider',
  },
  {
    value: InputParameterType.PASSWORD,
    label: 'Password Input',
  },
  {
    value: InputParameterType.BOOLEAN,
    label: 'Radio Group with Boolean options',
  },
  {
    value: InputParameterType.RADIO,
    label: 'Radio Group with Custom options',
  },
  {
    value: InputParameterType.SELECT,
    label: 'Select with Custom options',
  },
  {
    value: InputParameterType.STRING,
    label: 'String Input',
  },
  {
    value: InputParameterType.TEXTAREA,
    label: 'Text Area',
  },
];

/**
 * Boolean Parameter Options
 */
export const BooleanParameterOptions: SelectableValue[] = [
  {
    value: true,
    label: 'True',
  },
  {
    value: false,
    label: 'False',
  },
];
