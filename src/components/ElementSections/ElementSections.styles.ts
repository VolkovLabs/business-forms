import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    root: css`
      display: flex;
      width: 100%;
      justify-content: stretch;
      &.vertical {
        flex-direction: column;
      }
    `,
    dragIcon: css`
      cursor: grab;
      color: ${theme.colors.text.disabled};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    section: css`
      padding: ${theme.spacing(2.5)};
      flex: 1 0 auto;
      &.collapsable {
        padding: ${theme.spacing(0.5, 2.5)};
      }
    `,
  };
};
