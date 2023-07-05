import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    header: css`
      display: flex;
      align-items: center;
    `,
    removeButton: css`
      margin-left: ${theme.spacing(1)};
    `,
  };
};
