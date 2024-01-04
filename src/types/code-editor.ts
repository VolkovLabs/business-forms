/**
 * Supported Languages
 */
export const enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  JSON = 'json',
}

/**
 * Code Editor Type
 */
export enum CodeEditorType {
  REQUEST = 'request',
  GET_PAYLOAD = 'getPayload',
  ELEMENT_VALUE_CHANGED = 'elementValueChanged',
  ELEMENT_SHOW_IF = 'elementShowIf',
  ELEMENT_DISABLE_IF = 'elementDisableIf',
  ELEMENT_GET_OPTIONS = 'elementGetOptions',
}

/**
 * Code Editor Settings
 */
export interface CodeEditorSettings {
  /**
   * Language
   *
   * @type {CodeLanguage}
   */
  language: CodeLanguage;

  /**
   * Editor Type
   *
   * @type {CodeEditorType}
   */
  type: CodeEditorType;

  /**
   * Variables suggestions
   *
   * @type {boolean}
   */
  variablesSuggestions?: boolean;
}
