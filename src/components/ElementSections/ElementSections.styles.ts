import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    dragIcon: css`
      cursor: grab;
      color: ${theme.colors.text.disabled};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    td: css`
      padding: 20px;
      vertical-align: top;
    `,
    tdCollapse: css`
      padding: 5px 20px;
      vertical-align: top;
    `,
  };
};
