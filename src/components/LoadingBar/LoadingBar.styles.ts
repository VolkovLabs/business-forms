import { css, keyframes } from '@emotion/css';

/**
 * Styles
 */
export const getStyles = () => {
  return {
    animation: keyframes({
      '0%': {
        transform: 'translateX(-50%)',
      },
      '100%': {
        transform: `translateX(100%)`,
      },
    }),
    bar: css({
      width: '28%',
      height: 1,
      background: 'linear-gradient(90deg, rgba(110, 159, 255, 0) 0%, #6E9FFF 80.75%, rgba(110, 159, 255, 0) 100%)',
    }),
  };
};
