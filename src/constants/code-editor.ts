import { SelectableValue } from '@grafana/data';

/**
 * Code Editor
 */
export const CodeEditorHeight = 100;
export const CodeEditorDefault = 'console.log(options, data, response, elements, locationService, templateService)';

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
