import { SelectableValue } from '@grafana/data';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

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

/**
 * Suggestions
 */
export const CodeEditorSuggestions: CodeEditorSuggestionItem[] = [
  {
    label: 'options',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: "Panels' options.",
  },
  {
    label: 'data',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Result set of panel queries.',
  },
  {
    label: 'response',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: "Request's response",
  },
  {
    label: 'initial',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Parsed values from the Initial Request.',
  },
  {
    label: 'elements',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Form Elements.',
  },
  {
    label: 'locationService',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Allows to work with browser location and history.',
  },
  {
    label: 'templateService',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Provides access to variables and allows to update Time Range.',
  },
  {
    label: 'onOptionsChange',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Change handler to refresh panel.',
  },
  {
    label: 'initialRequest',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Perform the Initial Request to reload panel.',
  },
  {
    label: 'setInitial',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Allows to specify the initial values.',
  },
  {
    label: 'notifySuccess',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Display successful notification.',
  },
  {
    label: 'notifyError',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Display error notification.',
  },
];
