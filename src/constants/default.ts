import { FormElement } from '../types';
import { FormElementType } from './form-element';

/**
 * Initial Request
 */
export const InitialHighlightColorDefault = 'red';

/**
 * Submit Button
 */
export const SubmitIconDefault = 'cloud-upload';
export const SubmitBackgroundColorDefault = 'purple';
export const SubmitForegroundColorDefault = 'yellow';
export const SubmitTextDefault = 'Submit';

/**
 * Reset Button
 */
export const ResetIconDefault = 'process';
export const ResetBackgroundColorDefault = 'purple';
export const ResetForegroundColorDefault = 'yellow';
export const ResetTextDefault = 'Reset';

/**
 * Slider Defaults
 */
export const SliderDefault = {
  min: 0,
  max: 10,
  step: 1,
  value: 0,
};

/**
 * Form Element
 */
export const FormElementDefault: FormElement = {
  id: '',
  title: '',
  type: FormElementType.STRING,
  labelWidth: 10,
  tooltip: '',
  section: '',
  hidden: false,
};
