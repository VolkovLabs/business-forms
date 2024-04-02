import { SelectableValue } from '@grafana/data';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

import { CodeEditorType, CodeLanguage } from '../types';
import {
  disableIfCodeParameters,
  elementValueChangedCodeParameters,
  getOptionsCodeParameters,
  getPayloadCodeParameters,
  requestCodeParameters,
  showIfCodeParameters,
} from '../utils/code-parameters';

/**
 * Code Editor Config
 */
export const CODE_EDITOR_CONFIG = {
  height: {
    min: 200,
    max: 1000,
  },
  lineHeight: 18,
};

/**
 * Code Language Options
 */
export const CODE_LANGUAGE_OPTIONS: SelectableValue[] = [
  {
    value: CodeLanguage.C,
    label: 'C',
  },
  {
    value: CodeLanguage.CPP,
    label: 'C++',
  },
  {
    value: CodeLanguage.CSHARP,
    label: 'C#',
  },
  {
    value: CodeLanguage.GO,
    label: 'GO',
  },
  {
    value: CodeLanguage.JAVA,
    label: 'Java',
  },
  {
    value: CodeLanguage.JAVASCRIPT,
    label: 'Javascript',
  },
  {
    value: CodeLanguage.JSON,
    label: 'JSON',
  },
  {
    value: CodeLanguage.MYSQL,
    label: 'MySQL',
  },
  {
    value: CodeLanguage.PHP,
    label: 'PHP',
  },
  {
    value: CodeLanguage.PGSQL,
    label: 'PostgreSQL',
  },
  {
    value: CodeLanguage.PYTHON,
    label: 'Python',
  },
  {
    value: CodeLanguage.RUBY,
    label: 'Ruby',
  },
  {
    value: CodeLanguage.SQL,
    label: 'SQL',
  },
  {
    value: CodeLanguage.TYPESCRIPT,
    label: 'TypeScript',
  },
];

/**
 * Request Code Suggestions
 */
const REQUEST_CODE_SUGGESTIONS: CodeEditorSuggestionItem[] = [
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
];

/**
 * Suggestions
 */
export const CODE_EDITOR_SUGGESTIONS: Record<CodeEditorType, CodeEditorSuggestionItem[]> = {
  /**
   * Initial, update or reset request
   */
  [CodeEditorType.REQUEST]: [
    ...REQUEST_CODE_SUGGESTIONS,

    /**
     * Context
     */
    ...requestCodeParameters.suggestions,
  ],

  /**
   * Get data source payload
   */
  [CodeEditorType.GET_PAYLOAD]: [
    {
      label: 'elements',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Form Elements.',
    },
    {
      label: 'initial',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Parsed values from the Initial Request.',
    },
    /**
     * Context
     */
    ...getPayloadCodeParameters.suggestions,
  ],

  /**
   * Element value changed
   */
  [CodeEditorType.ELEMENT_VALUE_CHANGED]: elementValueChangedCodeParameters.suggestions,

  /**
   * Element disable if
   */
  [CodeEditorType.ELEMENT_DISABLE_IF]: [
    {
      label: 'elements',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Form Elements.',
    },
    {
      label: 'replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },

    /**
     * Context
     */
    ...disableIfCodeParameters.suggestions,
  ],

  /**
   * Element show if
   */
  [CodeEditorType.ELEMENT_SHOW_IF]: [
    {
      label: 'elements',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Form Elements.',
    },
    {
      label: 'replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },

    /**
     * Context
     */
    ...showIfCodeParameters.suggestions,
  ],

  /**
   * Element get options
   */
  [CodeEditorType.ELEMENT_GET_OPTIONS]: [
    {
      label: 'data',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Result set of panel queries.',
    },
    {
      label: 'elements',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Form Elements.',
    },
    {
      label: 'replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },

    /**
     * Context
     */
    ...getOptionsCodeParameters.suggestions,
  ],
};
