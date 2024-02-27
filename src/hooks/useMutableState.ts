import { MutableRefObject, useCallback, useRef, useState } from 'react';

/**
 * Use Mutable State
 * @param initialValue
 */
export const useMutableState = <TValue>(
  initialValue: TValue
): [TValue, (value: TValue) => void, MutableRefObject<TValue>] => {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef<TValue>(value);

  const onChange = useCallback((value: TValue) => {
    setValue(value);
    valueRef.current = value;
  }, []);

  return [value, onChange, valueRef];
};
