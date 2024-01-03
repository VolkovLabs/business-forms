import { StandardEditorProps } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { CodeEditorSuggestionItem, CodeEditorSuggestionItemKind } from '@grafana/ui';
/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';
import React, { useCallback } from 'react';

import { CODE_EDITOR_SUGGESTIONS, TEST_IDS } from '../../constants';
import { CodeEditorSettings, CodeLanguage } from '../../types';
import { AutosizeCodeEditor } from '../AutosizeCodeEditor';

/**
 * Properties
 */
type Props = StandardEditorProps<string, CodeEditorSettings, null>;

/**
 * Custom Code Editor
 */
export const CustomCodeEditor: React.FC<Props> = ({ value, item, onChange }) => {
  /**
   * Language
   */
  const language = item.settings?.language || CodeLanguage.JAVASCRIPT;

  /**
   * Template Service to get Variables
   */
  const templateSrv = getTemplateSrv();

  /**
   * Format On Mount
   */
  const onEditorMount = (editor: monacoType.editor.IStandaloneCodeEditor) => {
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument').run();
    }, 100);
  };

  /**
   * Suggestions
   *
   * Will skip adding suggestions if settings are not defined to avoid duplicates
   */
  const getSuggestions = useCallback((): CodeEditorSuggestionItem[] => {
    /**
     * Add Variables
     */
    const variablesSuggestions = item.settings?.variablesSuggestions
      ? templateSrv.getVariables().map((variable) => {
          return {
            label: `\$\{${variable.name}\}`,
            kind: CodeEditorSuggestionItemKind.Property,
            detail: variable.description ? variable.description : variable.label,
          };
        })
      : [];

    return item.settings?.type
      ? CODE_EDITOR_SUGGESTIONS[item.settings.type].concat(variablesSuggestions)
      : variablesSuggestions;
  }, [item.settings, templateSrv]);

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.customCodeEditor.root}>
      <AutosizeCodeEditor
        language={language}
        showLineNumbers={true}
        showMiniMap={!!value && value.length > 100}
        value={value}
        onBlur={onChange}
        onSave={onChange}
        monacoOptions={{ formatOnPaste: true, formatOnType: true, scrollBeyondLastLine: false }}
        onEditorDidMount={onEditorMount}
        getSuggestions={getSuggestions}
      />
    </div>
  );
};
