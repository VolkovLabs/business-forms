import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';
import { CodeEditorHeight, CodeLanguageDefault } from '../../constants';

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
  const language = item.settings?.language || CodeLanguageDefault;

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
        height={CodeEditorHeight}
        onBlur={(code) => {
          onChange(code);
        }}
      />
    </div>
  );
};
