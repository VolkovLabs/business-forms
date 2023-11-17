import { useStyles2 } from '@grafana/ui';
import React, { CSSProperties } from 'react';

import { Styles } from './LoadingBar.styles';

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
const MILLISECONDS_PER_PIXEL = 2.4;
const MIN_DURATION_MS = 500;
const MAX_DURATION_MS = 4000;

/**
 * Loading Bar
 * Not available in Grafana 9
 */
export const LoadingBar = ({ width, ariaLabel = 'Loading bar' }: LoadingBarProps) => {
  const styles = useStyles2(Styles);
  const durationMs = Math.min(Math.max(Math.round(width * MILLISECONDS_PER_PIXEL), MIN_DURATION_MS), MAX_DURATION_MS);

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
