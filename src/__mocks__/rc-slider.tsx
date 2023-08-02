import React from 'react';

/**
 * Mock RC Slider
 */
const RcSlider: React.FC<any> = ({ onChange, ariaLabelForHandle, value }) => {
  return (
    <input
      type="number"
      onChange={(event) => {
        if (onChange) {
          onChange(Number(event.target.value));
        }
      }}
      aria-label={ariaLabelForHandle}
      value={value}
    />
  );
};

export default RcSlider;
