import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    header: css`
      padding: ${theme.spacing(0.5, 0.5)};
      border-radius: ${theme.shape.radius.default};
      background: ${theme.colors.background.secondary};
      min-height: ${theme.spacing(4)};
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;

      &:focus {
        outline: none;
      }
    `,
    title: css`
      font-weight: ${theme.typography.fontWeightBold};
      margin-left: ${theme.spacing(0.5)};
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    collapseIcon: css`
      margin-left: ${theme.spacing(0.5)};
      color: ${theme.colors.text.disabled};
    `,
    actions: css`
      margin-left: auto;
      display: flex;
      align-items: center;
    `,
    content: css`
      margin-top: ${theme.spacing(0.5)};
      margin-left: ${theme.spacing(0.5)};
    `,
  };
};
