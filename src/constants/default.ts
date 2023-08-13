import { CodeOptions, FormElement, NumberOptions, SliderOptions, TextareaOptions } from '../types';
import { CodeEditorHeight, CodeLanguage } from './code-editor';
import { FormElementType } from './form-element';

/**
 * Initial Request
 */
export const CodeInitialDefault = 'console.log(data, response, initial, elements)';

/**
 * Update Requestt
 */
export const CodeUpdateDefault = `if (response && response.ok) {
  notifySuccess(['Update', 'Values updated successfully.']);
  locationService.reload();
} else {
  notifyError(['Update', 'An error occured updating values.']);
}`;

/**
 * Initial Payload
 */
export const PayloadInitialDefault = `return {
  rawSql: '',
  format: 'table',
}`;

/**
 * Update Payload
 */
export const PayloadUpdateDefault = `const payload = {};

elements.forEach((element) => {
  if (!element.value) {
    return;
  }

  payload[element.id] = element.value;
})

return payload;

/**
 * Data Source payload
 */ 
return {
  rawSql: '',
  format: 'table',
};`;

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
 * Save Default Button
 */
export const SaveDefaultIconDefault = 'save';
export const SaveDefaultTextDefault = 'Save Default';

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
  uid: '',
  id: '',
  title: '',
  type: FormElementType.STRING,
  width: null,
  labelWidth: 10,
  tooltip: '',
  section: '',
  hidden: false,
  unit: '',
  value: '',
};
