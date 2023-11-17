import { getJestSelectors } from '@volkovlabs/jest-selectors';

import { TestIds } from '../constants';

/**
 * Get Custom Code Editor Selectors
 */
export const getCustomCodeEditorSelectors = getJestSelectors(TestIds.customCodeEditor);

/**
 * Get Form Elements Selectors
 */
export const getFormElementsSelectors = getJestSelectors(TestIds.formElements, ['fieldDateTime']);

/**
 * Get Form Elements Editor Selectors
 */
export const getFormElementsEditorSelectors = getJestSelectors(TestIds.formElementsEditor, ['fieldDateTime']);

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
