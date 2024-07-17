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
    description: css`
      color: ${theme.colors.text.secondary};
      font-size: 12px;
      font-weight: 400;
      margin-top: 2px;
    `,
    buttonWrap: css`
      min-height: 32px;
    `,
    label: css`
      align-self: center;
      margin-right: ${theme.spacing(1)};
    `,
  };
};
