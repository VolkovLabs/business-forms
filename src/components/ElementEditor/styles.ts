import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    optionsContainer: css`
      margin-bottom: ${theme.spacing(0.5)};
    `,
  };
};
