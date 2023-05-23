import { Screen, GetByBoundAttribute, BoundFunctions, Queries } from '@testing-library/react';
import { TestIds } from './constants';

type JestSelector<Args extends unknown[]> = (
  noThrowOnNotFound?: boolean,
  ...args: Args
) => ReturnType<GetByBoundAttribute>;

type JestSelectors<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => void ? JestSelector<Args> : JestSelector<[]>;
};

/**
 * Get Jest Selectors
 * @param selectors
 * @param enforceTestIdSelectorForKeys
 */
const getJestSelectors =
  <Selectors extends Record<keyof Selectors, Selectors[keyof Selectors]>>(
    selectors: Selectors,
    enforceTestIdSelectorForKeys: Array<keyof Selectors> = []
  ): ((screen: Screen | BoundFunctions<Queries>) => JestSelectors<Selectors>) =>
  (screen) => {
    return Object.entries(selectors).reduce((acc, [key, selector]) => {
      /**
       * Get Element function
       * @param noThrowOnNotFound
       * @param args
       */
      const getElement = (noThrowOnNotFound = false, ...args: unknown[]) => {
        const value = typeof selector === 'function' ? selector(...args) : selector;
        if (value.startsWith('data-testid') || enforceTestIdSelectorForKeys.includes(key as keyof Selectors)) {
          return noThrowOnNotFound ? screen.queryByTestId(value) : screen.getByTestId(value);
        }
        return noThrowOnNotFound ? screen.queryByLabelText(value) : screen.getByLabelText(value);
      };

      return {
        ...acc,
        [key]: getElement,
      };
    }, {} as JestSelectors<Selectors>);
  };

/**
 * Get Custom Code Editor Selectors
 */
export const getCustomCodeEditorSelectors = getJestSelectors(TestIds.customCodeEditor);

/**
 * Get Form Elements Selectors
 */
export const getFormElementsSelectors = getJestSelectors(TestIds.formElements, ['fieldDateTime', 'fieldCode']);

/**
 * Get Form Elements Editor Selectors
 */
export const getFormElementsEditorSelectors = getJestSelectors(TestIds.formElementsEditor);

/**
 * Get Panel Selectors
 */
export const getPanelSelectors = getJestSelectors(TestIds.panel);

/**
 * Get Header Parameters Editor Selectors
 */
export const getHeaderParametersEditorSelectors = getJestSelectors(TestIds.headerParametersEditor);

/**
 * Get Layout Sections Editor Selectors
 */
export const getLayoutSectionsEditorSelectors = getJestSelectors(TestIds.layoutSectionsEditor);
