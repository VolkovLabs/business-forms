import { SelectableValue } from '@grafana/data';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';

import { CodeEditorType, CodeLanguage } from '../types';

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
    value: CodeLanguage.JAVASCRIPT,
    label: 'Javascript',
  },
  {
    value: CodeLanguage.JSON,
    label: 'JSON',
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
 * Base Context Suggestions
 */
const BASE_CONTEXT_SUGGESTIONS: CodeEditorSuggestionItem[] = [
  /**
   * Context
   */
  {
    label: 'context',
    kind: CodeEditorSuggestionItemKind.Constant,
    detail: 'All passed possible properties and methods.',
  },

  /**
   * Panel
   */
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
    label: 'context.panel.enableSubmit',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Enable submit button.',
  },
  {
    label: 'context.panel.disableSubmit',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Disable submit button.',
  },

  /**
   * Grafana
   */
  {
    label: 'context.grafana',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Grafana properties and methods.',
  },
  {
    label: 'context.grafana.backendService',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Backend service.',
  },
  {
    label: 'context.grafana.locationService',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Location service.',
  },
  {
    label: 'context.grafana.templateService',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Template variables service.',
  },
  {
    label: 'context.grafana.notifyError',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Show error notification.',
  },
  {
    label: 'context.grafana.notifySuccess',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Show success notification.',
  },
  {
    label: 'context.grafana.notifyWarning',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Show warning notification.',
  },
  {
    label: 'context.grafana.eventBus',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Panels events.',
  },
  {
    label: 'context.grafana.appEvents',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Application events.',
  },
  {
    label: 'context.grafana.refresh',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Refresh dashboard.',
  },
  {
    label: 'context.utils',
    kind: CodeEditorSuggestionItemKind.Property,
    detail: 'Utils/helpers functions.',
  },
  {
    label: 'context.utils.toDataQueryResponse',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Parse the results from /api/ds/query.',
  },
  {
    label: 'context.utils.fileToBase64',
    kind: CodeEditorSuggestionItemKind.Method,
    detail: 'Converts File to Base64 string.',
  },
];

/**
 * Suggestions
 */
export const CODE_EDITOR_SUGGESTIONS: Record<CodeEditorType, CodeEditorSuggestionItem[]> = {
  /**
   * Initial, update or reset request
   */
  [CodeEditorType.REQUEST]: [...REQUEST_CODE_SUGGESTIONS, ...BASE_CONTEXT_SUGGESTIONS],

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
    ...BASE_CONTEXT_SUGGESTIONS.filter((item) =>
      ['context', 'context.panel.elements', 'context.panel.initial', 'context.utils.fileToBase64'].includes(item.label)
    ),
  ],

  /**
   * Element value changed
   */
  [CodeEditorType.ELEMENT_VALUE_CHANGED]: [
    ...BASE_CONTEXT_SUGGESTIONS,
    {
      label: 'context.element',
      kind: CodeEditorSuggestionItemKind.Property,
      detail: 'Form Element which value has been changed.',
    },
    {
      label: 'context.panel.setError',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Set panel error.',
    },
    {
      label: 'context.panel.enableReset',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Enable reset button.',
    },
    {
      label: 'context.panel.disableReset',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Disable reset button.',
    },
    {
      label: 'context.panel.enableSubmit',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Enable submit button.',
    },
    {
      label: 'context.panel.disableSubmit',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Disable submit button.',
    },
    {
      label: 'context.panel.enableSaveDefault',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Enable save default button.',
    },
    {
      label: 'context.panel.disableSaveDefault',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Disable save default button.',
    },
  ],

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
    ...BASE_CONTEXT_SUGGESTIONS.filter((item) => ['context', 'context.panel.elements'].includes(item.label)),
    {
      label: 'context.grafana.replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },
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
    ...BASE_CONTEXT_SUGGESTIONS.filter((item) => ['context', 'context.panel.elements'].includes(item.label)),
    {
      label: 'context.grafana.replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },
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
    ...BASE_CONTEXT_SUGGESTIONS.filter((item) =>
      ['context', 'context.panel.data', 'context.panel.elements'].includes(item.label)
    ),
    {
      label: 'context.grafana.replaceVariables',
      kind: CodeEditorSuggestionItemKind.Method,
      detail: 'Interpolate variables.',
    },
  ],
};
