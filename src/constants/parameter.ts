import { CapitalizeFirstLetter } from '../utils';

/**
 * Input Parameter Type
 */
export const enum InputParameterType {
  NUMBER = 'number',
  STRING = 'string',
  BOOLEAN = 'boolean',
  RADIO = 'radio',
  SLIDER = 'slider',
  DROPDOWN = 'dropdown',
}

/**
 * Input Parameter Type Options
 */
export const InputParameterTypeOptions = [
  {
    value: InputParameterType.STRING,
    label: CapitalizeFirstLetter(InputParameterType.STRING),
  },
  {
    value: InputParameterType.NUMBER,
    label: CapitalizeFirstLetter(InputParameterType.NUMBER),
  },
  {
    value: InputParameterType.BOOLEAN,
    label: CapitalizeFirstLetter(InputParameterType.BOOLEAN),
  },
  {
    value: InputParameterType.RADIO,
    label: CapitalizeFirstLetter(InputParameterType.RADIO),
  },
  {
    value: InputParameterType.SLIDER,
    label: CapitalizeFirstLetter(InputParameterType.SLIDER),
  },
  {
    value: InputParameterType.DROPDOWN,
    label: CapitalizeFirstLetter(InputParameterType.DROPDOWN),
  },
];

/**
 * Boolean Parameter Options
 */
export const BooleanParameterOptions = [
  {
    value: true,
    label: 'True',
  },
  {
    value: false,
    label: 'False',
  },
];
