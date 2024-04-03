/**
 * Supported Languages
 */
export const enum CodeLanguage {
  C = 'c',
  CPP = 'cpp',
  CSHARP = 'csharp',
  GO = 'go',
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  JSON = 'json',
  MYSQL = 'mysql',
  PHP = 'php',
  PGSQL = 'pgsql',
  PYTHON = 'python',
  RUBY = 'ruby',
  SQL = 'sql',
  TYPESCRIPT = 'typescript',
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
