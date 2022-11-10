import { SelectableValue } from '@grafana/data';

/**
 * Code Editor
 */
export const CodeEditorHeight = 200;
export const CodeInitialDefault = 'console.log(data, response, initial, elements)';
export const CodeUpdateDefault = `if (response && response.ok) {
  notifySuccess(['Update', 'Values updated successfully.']);
  locationService.reload();
} else {
  notifyError(['Update', 'An error occured updating values.']);
}`;

/**
 * Supported Languages
 */
export const enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  JSON = 'json',
}

/**
 * Code Language Options
 */
export const CodeLanguageOptions: SelectableValue[] = [
  {
    value: CodeLanguage.JAVASCRIPT,
    label: 'Javascript',
  },
  {
    value: CodeLanguage.JSON,
    label: 'JSON',
  },
];
