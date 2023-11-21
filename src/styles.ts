import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    wrapper: css`
      position: relative;
      overflow-y: auto;
    `,
    loadingBar: css`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    `,
    table: css`
      width: 100%;
    `,
    td: css`
      padding: 20px;
      vertical-align: top;
    `,
    margin: css`
      margin: 5px;
    `,
    button: {
      center: css`
        display: flex;
        align-items: center;
        justify-content: center;
      `,
      left: css`
        float: left;
      `,
      right: css`
        float: right;
      `,
    },
    confirmTable: css`
      width: 100%;
      border: 1px solid;
      text-align: center;
    `,
    confirmTableTd: css`
      border: 1px solid;
    `,
    slider: css`
      .rc-slider {
        margin: 10px 0 0 0;
      }
      .rc-slider-mark-text {
        color: ${theme.colors.text.disabled};
        font-size: ${theme.typography.bodySmall.fontSize};
      }
      .rc-slider-mark-text-active {
        color: ${theme.colors.text.primary};
      }
      .rc-slider-handle {
        border: none;
        background-color: ${theme.colors.primary.main};
        box-shadow: ${theme.shadows.z1};
        cursor: pointer;
      }
      .rc-slider-handle:hover,
      .rc-slider-handle:active,
      .rc-slider-handle:focus,
      .rc-slider-handle-click-focused:focus,
      .rc-slider-dot-active {
        ${`box-shadow: 0px 0px 0px 6px ${theme.colors.primary.transparent}`};
      }
      .rc-slider-track {
        background-color: ${theme.colors.primary.main};
      }
      .rc-slider-rail {
        background-color: ${theme.colors.border.strong};
        cursor: pointer;
      }
    `,
    sliderInput: css`
      margin-left: 15px;
    `,
    hidden: css`
      display: none;
    `,
    link: css`
      min-height: ${theme.spacing(4)};
      display: flex;
      align-items: center;
    `,
  };
};
