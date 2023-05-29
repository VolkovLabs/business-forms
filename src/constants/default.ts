import { CodeOptions, FormElement, NumberOptions, SliderOptions, TextareaOptions } from '../types';
import { CodeEditorHeight, CodeLanguage } from './code-editor';
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
 * Number Defaults
 */
export const NumberDefault: NumberOptions = {
  min: null,
  max: null,
  value: 0,
};

/**
 * Slider Defaults
 */
export const SliderDefault: SliderOptions = {
  min: 0,
  max: 10,
  step: 1,
  value: 0,
};

/**
 * Code Defaults
 */
export const CodeDefault: CodeOptions = {
  height: CodeEditorHeight,
  language: CodeLanguage.JAVASCRIPT,
};

/**
 * Textarea Defaults
 */
export const TextareaDefault: TextareaOptions = {
  rows: 10,
};

/**
 * Form Element
 */
export const FormElementDefault: FormElement = {
  id: '',
  title: '',
  type: FormElementType.STRING,
  width: 0,
  labelWidth: 10,
  tooltip: '',
  section: '',
  hidden: false,
  unit: '',
  value: '',
};
