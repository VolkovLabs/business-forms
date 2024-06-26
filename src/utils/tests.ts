import { getJestSelectors } from '@volkovlabs/jest-selectors';

import { TEST_IDS } from '../constants';

/**
 * Get Custom Code Editor Selectors
 */
export const getCustomCodeEditorSelectors = getJestSelectors(TEST_IDS.customCodeEditor);

/**
 * Get Form Elements Selectors
 */
export const getFormElementsSelectors = getJestSelectors(TEST_IDS.formElements, ['fieldDateTime']);

/**
 * Get Form Elements Selectors
 */
export const getFormElementsSectionSelectors = getJestSelectors(TEST_IDS.formElementsSection);

/**
 * Get Form Elements Editor Selectors
 */
export const getFormElementsEditorSelectors = getJestSelectors(TEST_IDS.formElementsEditor, ['fieldDateTime']);

/**
 * Get Panel Selectors
 */
export const getPanelSelectors = getJestSelectors(TEST_IDS.panel);

/**
 * Get Header Parameters Editor Selectors
 */
export const getHeaderParametersEditorSelectors = getJestSelectors(TEST_IDS.headerParametersEditor);

/**
 * Get Layout Sections Editor Selectors
 */
export const getLayoutSectionsEditorSelectors = getJestSelectors(TEST_IDS.layoutSectionsEditor);

import { SelectableValue } from '@grafana/data';

/**
 * Get Options with testId
 * @param options
 * @param selector
 */
export const getOptionsWithTestId = (options: SelectableValue[], selector: (name: unknown) => string) => {
  return options.map((option) => ({
    ...option,
    ariaLabel: selector(option.value),
  }));
};
