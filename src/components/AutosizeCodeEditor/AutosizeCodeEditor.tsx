import { CodeEditor } from '@grafana/ui';
import React, { useEffect, useState } from 'react';

import { CODE_EDITOR_CONFIG } from '../../constants';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof CodeEditor>;

/**
 * Get Height By Value
 * @param value
 */
const getHeightByValue = (value: string) => {
  const height = value.split('\n').length * CODE_EDITOR_CONFIG.lineHeight;

  if (height < CODE_EDITOR_CONFIG.height.min) {
    return CODE_EDITOR_CONFIG.height.min;
  }

  if (height > CODE_EDITOR_CONFIG.height.max) {
    return CODE_EDITOR_CONFIG.height.max;
  }

  return height;
};

/**
 * Autosize Code Editor
 * @constructor
 */
export const AutosizeCodeEditor: React.FC<Props> = ({ value, onChange, height: staticHeight, ...restProps }) => {
  /**
   * Height
   */
  const [height, setHeight] = useState(getHeightByValue(value));

  /**
   * Update Height on value change
   */
  useEffect(() => {
    setHeight(getHeightByValue(value));
  }, [value]);

  return (
    <CodeEditor
      value={value}
      onChange={(value) => {
        onChange?.(value);
        setHeight(getHeightByValue(value));
      }}
      height={staticHeight ?? height}
      {...restProps}
    />
  );
};
