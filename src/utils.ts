import { FormElement } from './types';

/**
 * Capitalize First Letter
 */
export const CapitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Move Form Elements
 */
export const MoveFormElements = (elements: FormElement[], from: number, to: number) => {
  const element = elements[from];
  elements.splice(from, 1);
  elements.splice(to, 0, element);
};
