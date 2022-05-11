import { InputParameter } from '../types';
import { InputParameterType } from './parameter';

/**
 * Code Editor
 */
export const CodeEditorHeight = '100px';
export const CodeEditorDefault = 'console.log(response)';
export const CodeLanguageDefault = 'javascript';

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
 * Input Parameter
 */
export const InputParameterDefault: InputParameter = { id: '', title: '', type: InputParameterType.STRING };
