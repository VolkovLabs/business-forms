import { InputParameter } from './types';

/**
 * Capitalize First Letter
 */
export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Move Input Parameters
 */
export const MoveInputParameters = (array: InputParameter[], from: number, to: number) => {
  const element = array[from];
  array.splice(from, 1);
  array.splice(to, 0, element);
};
