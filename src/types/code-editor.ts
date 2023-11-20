/**
 * Supported Languages
 */
export const enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  JSON = 'json',
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
   * Suggestions
   *
   * @type {boolean}
   */
  suggestions: boolean;
}
