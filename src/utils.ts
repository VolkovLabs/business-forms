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
export const MoveInputParameters = (parameters: InputParameter[], from: number, to: number) => {
  const element = parameters[from];
  parameters.splice(from, 1);
  parameters.splice(to, 0, element);
};
