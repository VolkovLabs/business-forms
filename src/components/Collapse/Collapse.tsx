import React from 'react';
import { IconButton, useTheme2 } from '@grafana/ui';
import { Styles } from './styles';

/**
 * Properties
 */
interface Props {
  title?: React.ReactElement | string;
  actions?: React.ReactElement;
  children?: React.ReactElement | string;
  isOpen?: boolean;
  onToggle?: () => void;
  headerTestId?: string;
  contentTestId?: string;
}

/**
 * Collapse
 */
export const Collapse: React.FC<Props> = ({
  title,
  actions,
  children,
  isOpen = false,
  onToggle,
  headerTestId,
  contentTestId,
}) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = Styles(theme);

  return (
    <>
      <div className={styles.header} data-testid={headerTestId} onClick={onToggle}>
        <IconButton
          name={isOpen ? 'angle-down' : 'angle-right'}
          tooltip={isOpen ? 'Collapse' : 'Expand'}
          className={styles.collapseIcon}
          aria-expanded={isOpen}
        />
        <div className={styles.title}>{title}</div>
        {actions && (
          <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
      {isOpen && (
        <div className={styles.content} data-testid={contentTestId}>
          {children}
        </div>
      )}
    </>
  );
};
