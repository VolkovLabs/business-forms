import { css } from '@emotion/css';

/**
 * Styles
 */
export const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
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
  };
};
