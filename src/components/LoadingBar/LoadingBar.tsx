import { useStyles2 } from '@grafana/ui';
import React, { CSSProperties } from 'react';

import { getStyles } from './LoadingBar.styles';

/**
 * Properties
 */
export interface LoadingBarProps {
  /**
   * Width
   */
  width: number;

  /**
   * Label
   */
  ariaLabel?: string;
}

/**
 * Constants
 */
const msPerPixel = 2.4;
const minDurationMs = 500;
const maxDurationMs = 4000;

/**
 * Loading Bar
 * Not available in Grafana 9
 */
export const LoadingBar = ({ width, ariaLabel = 'Loading bar' }: LoadingBarProps) => {
  const styles = useStyles2(getStyles);
  const durationMs = Math.min(Math.max(Math.round(width * msPerPixel), minDurationMs), maxDurationMs);

  /**
   * Style
   */
  const containerStyles: CSSProperties = {
    width: '100%',
    animation: `${styles.animation} ${durationMs}ms infinite linear`,
    willChange: 'transform',
  };

  return (
    <div style={containerStyles}>
      <div aria-label={ariaLabel} className={styles.bar} />
    </div>
  );
};
