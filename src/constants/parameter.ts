import { SelectableValue } from '@grafana/data';
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
  SELECT = 'select',
}

/**
 * Input Parameter Type Options
 */
export const InputParameterTypeOptions: SelectableValue[] = [
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
    value: InputParameterType.SLIDER,
    label: CapitalizeFirstLetter(InputParameterType.SLIDER),
  },
  {
    value: InputParameterType.RADIO,
    label: CapitalizeFirstLetter(InputParameterType.RADIO),
  },
  {
    value: InputParameterType.SELECT,
    label: CapitalizeFirstLetter(InputParameterType.SELECT),
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

/**
 * Slider Defaults
 */
export const SliderDefault = {
  min: 0,
  max: 10,
  step: 1,
};
