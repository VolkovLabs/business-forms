import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    item: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    dragHandle: css`
      display: flex;
      margin: ${theme.spacing(0, 0.5)};
    `,
    dragIcon: css`
      cursor: grab;
      color: ${theme.colors.text.disabled};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    groupIcon: css`
      color: ${theme.colors.text.disabled};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    removeButton: css`
      margin-left: ${theme.spacing(1)};
      color: ${theme.colors.text.secondary};
    `,
  };
};
