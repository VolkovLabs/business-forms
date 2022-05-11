import { SelectableValue } from '@grafana/data';
import { InputParameter } from '../types';
import { InputParameterType } from './parameter';

/**
 * Default Language to Code Editor
 */
export const CodeLanguageDefault = 'javascript';

/**
 * Code Editor Height
 */
export const CodeEditorHeight = '100px';

/**
 * Code Editor Default
 */
export const CodeEditorDefault = 'console.log(response)';

/**
 * Default Icon for Submit Button
 */
export const SubmitIconDefault = 'cloud-upload';

/**
 * Default Background Color for Submit Button
 */
export const SubmitBackgroundColorDefault = 'purple';

/**
 * Default Foreground Color for Submit Button
 */
export const SubmitForegroundColorDefault = 'yellow';

/**
 * Default Text for Submit Button
 */
export const SubmitTextDefault = 'Submit';

/**
 * Slider Defaults
 */
export const SliderDefault = {
  min: 0,
  max: 10,
  step: 1,
};

/**
 * Default for Input Parameter
 */
export const InputParameterDefault: InputParameter = { id: '', title: '', type: InputParameterType.STRING };

/**
 * Default for Input Parameter Option
 */
export const InputParameterOptionDefault: SelectableValue = { value: '', label: '' };
