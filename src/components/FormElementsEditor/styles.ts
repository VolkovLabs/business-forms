import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    item: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    header: css`
      label: Header;
      padding: ${theme.spacing(0.5, 0.5)};
      border-radius: ${theme.shape.borderRadius(1)};
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
    dragIcon: css`
      cursor: grab;
      color: ${theme.colors.text.disabled};
      margin: ${theme.spacing(0, 0.5)};
      &:hover {
        color: ${theme.colors.text};
      }
    `,
    collapseIcon: css`
      margin-left: ${theme.spacing(0.5)};
      color: ${theme.colors.text.disabled};
    }
    `,
    headerControls: css`
      margin-left: auto;
      display: flex;
      align-items: center;
    `,
    removeButton: css`
      margin-left: ${theme.spacing(1)};
      color: ${theme.colors.text.secondary};
    `,
    content: css`
      margin-top: ${theme.spacing(0.5)};
      margin-left: ${theme.spacing(0.5)};
    `,
  };
};
