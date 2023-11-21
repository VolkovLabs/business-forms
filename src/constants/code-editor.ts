import { SelectableValue } from '@grafana/data';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

import { CodeLanguage } from '../types';

/**
 * Code Editor Config
 */
export const CodeEditorConfig = {
  height: {
    min: 200,
    max: 2000,
  },
  lineHeight: 18,
};

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
  {
    label: 'notifyWarning',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Display warning notification.',
  },
  {
    label: 'toDataQueryResponse',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Parse the results from /api/ds/query.',
  },
  {
    label: 'context',
    kind: CodeEditorSuggestionItemKind.Constant,
    detail: 'All passed possible properties and methods.',
  },
  {
    label: 'context.panel',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Panel instance properties.',
  },
  {
    label: 'context.panel.data',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Panel data.',
  },
  {
    label: 'context.panel.options',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Panel options.',
  },
  {
    label: 'context.panel.onOptionsChange',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Update panel options on dashboard.',
  },
  {
    label: 'context.panel.elements',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Panel elements.',
  },
  {
    label: 'context.panel.onChangeElements',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Update panel elements.',
  },
  {
    label: 'context.panel.initial',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Set initial values.',
  },
  {
    label: 'context.panel.initialRequest',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Run Initial Request.',
  },
  {
    label: 'context.panel.response',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Response object.',
  },
  {
    label: 'context.grafana',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Grafana properties and methods.',
  },
];
