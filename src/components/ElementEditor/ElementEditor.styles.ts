import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    optionsContainer: css`
      margin: ${theme.spacing(1, 0)};
    `,
  };
};
