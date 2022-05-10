import { css } from '@emotion/css';

/**
 * Styles
 */
export const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
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
