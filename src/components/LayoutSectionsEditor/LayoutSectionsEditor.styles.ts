import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    item: css`
      margin-bottom: ${theme.spacing(1)};
      border: 1px solid ${theme.colors.border.weak};
      padding: ${theme.spacing(1)};
    `,
    checkbox: css`
      display: flex;
      align-items: center;
      height: auto;
      margin: ${theme.spacing(0, 1, 0.5, 0.5)};
    `,
  };
};
