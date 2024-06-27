import { css } from '@emotion/css';

/**
 * Styles
 */
export const getStyles = () => {
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
      overflow: hidden;
    `,
    table: css`
      width: 100%;
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
  };
};
