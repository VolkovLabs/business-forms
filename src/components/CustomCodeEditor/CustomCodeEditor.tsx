import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { CodeEditor, Monaco } from '@grafana/ui';
import { CodeEditorHeight, CodeLanguage } from '../../constants';

/**
 * Monaco
 */
import type * as monacoType from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * Properties
 */
interface Props extends StandardEditorProps<string, any, any> {}

/**
 * Custom Code Editor
 */
export const CustomCodeEditor: React.FC<Props> = ({ value, item, onChange }) => {
  /**
   * Language
   */
  const language = item.settings?.language || CodeLanguage.JAVASCRIPT;

  /**
   * Format On Mount
   */
  const onEditorMount = (editor: monacoType.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument').run();
    }, 100);
  };

  /**
   * Return
   */
  return (
    <div>
      <CodeEditor
        language={language}
        showLineNumbers={true}
        showMiniMap={true}
        value={value}
        height={`${CodeEditorHeight}px`}
        onBlur={(code) => {
          onChange(code);
        }}
        monacoOptions={{ formatOnPaste: true, formatOnType: true }}
        onEditorDidMount={onEditorMount}
      />
    </div>
  );
};
