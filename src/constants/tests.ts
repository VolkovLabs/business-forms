import { selectors } from '@grafana/e2e-selectors';

/**
 * Tests Identifiers
 */
export const TestIds = {
  panel: {
    root: 'data-testid panel',
    infoMessage: 'data-testid panel info-message',
    singleLayoutContent: 'data-testid panel single-layout-content',
    splitLayoutContent: (sectionName: string) => `data-testid panel split-layout-content-${sectionName}`,
    buttonSubmit: 'data-testid panel button-submit',
    buttonReset: 'data-testid panel button-reset',
    errorMessage: 'data-testid panel error-message',
    /**
     * Default Confirm Button selector
     * https://github.com/grafana/grafana/blob/b43206e26ba8535a23af578b6297fee3f67f80b2/packages/grafana-ui/src/components/ConfirmModal/ConfirmModal.tsx#LL108C58-L108C59
     */
    buttonConfirmUpdate: selectors.pages.ConfirmModal.delete,
    confirmModalContent: 'data-testid panel confirm-modal-content',
    confirmModalField: (fieldId: string) => `data-testid panel confirm-modal-content field-${fieldId}`,
    confirmModalFieldTitle: `data-testid panel confirm-modal-content field field-title`,
    confirmModalFieldPreviousValue: `data-testid panel confirm-modal-content field field-previous-value`,
    confirmModalFieldValue: `data-testid panel confirm-modal-content field field-value`,
  },
  customCodeEditor: {
    root: 'data-testid custom-code-editor',
  },
  formElements: {
    root: 'data-testid form-elements',
    element: (elementId: string, elementType: string) =>
      `data-testid form-elements element-${elementId}-${elementType}`,
    fieldNumber: 'data-testid form-elements field-number',
    fieldString: 'data-testid form-elements field-string',
    fieldPassword: 'data-testid form-elements field-password',
    fieldDisabled: 'data-testid form-elements field-disabled',
    fieldTextarea: 'data-testid form-elements field-textarea',
    /**
     * Default Code Editor aria label selector
     * https://github.com/grafana/grafana/blob/6a12673f8b0e07bc2aeeed70defc461fdf93bca8/packages/grafana-ui/src/components/Monaco/CodeEditor.tsx#L148
     */
    fieldCode: selectors.components.CodeEditor.container,
    fieldBooleanContainer: 'data-testid form-elements field-boolean-container',
    /**
     * We should use default value for date-time-picker without data-testid prefix
     * https://github.com/grafana/grafana/blob/6a12673f8b0e07bc2aeeed70defc461fdf93bca8/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx#LL229C24-L229C39
     */
    fieldDateTime: 'date-time-input',
    fieldSlider: 'form-elements field-slider',
    fieldSliderInput: 'data-testid form-elements field-slider-input',
    fieldRadioContainer: 'data-testid form-elements field-radio-container',
    fieldSelect: 'form-elements field-select-container',
    booleanOption: (name: string) => `form-elements boolean-${name}`,
    unit: 'data-testid form-elements unit',
  },
  formElementsEditor: {
    root: 'data-testid form-elements-editor',
    sectionLabel: (id: string, type: string) => `data-testid form-elements-editor section-label-${id}-${type}`,
    sectionContent: (id: string, type: string) => `data-testid form-elements-editor section-content-${id}-${type}`,
    sectionNewLabel: 'data-testid form-elements-editor section-new-label',
    sectionNewContent: 'data-testid form-elements-editor section-new-content',
    buttonMoveElementUp: (id: string, type: string) =>
      `data-testid form-elements-editor button-move-element-up-${id}-${type}`,
    buttonMoveElementDown: (id: string, type: string) =>
      `data-testid form-elements-editor button-move-element-down-${id}-${type}`,
    buttonRemoveElement: 'data-testid form-elements-editor button-remove-element',
    buttonAddElement: 'data-testid form-elements-editor button-add-element',
    buttonRemoveOption: 'data-testid form-elements-editor button-remove-option',
    buttonAddOption: 'data-testid form-elements-editor button-add-option',
    fieldId: 'data-testid form-elements-editor field-id',
    fieldVisibility: 'data-testid form-elements-editor field-visibility',
    fieldType: 'form-elements-editor field-type',
    fieldWidth: 'data-testid form-elements-editor field-width',
    fieldLabel: 'data-testid form-elements-editor field-label',
    fieldLabelWidth: 'data-testid form-elements-editor field-label-width',
    fieldTooltip: 'data-testid form-elements-editor field-tooltip',
    fieldUnit: 'data-testid form-elements-editor field-unit',
    fieldSection: 'form-elements-editor field-section',
    fieldSliderMin: 'data-testid form-elements-editor field-slider-min',
    fieldSliderMax: 'data-testid form-elements-editor field-slider-max',
    fieldSliderStep: 'data-testid form-elements-editor field-slider-step',
    fieldNumberMin: 'data-testid form-elements-editor field-number-min',
    fieldNumberMax: 'data-testid form-elements-editor field-number-max',
    fieldTextareaRows: 'data-testid form-elements-editor field-textarea-rows',
    fieldCodeLanguage: 'form-elements-editor field-code-language',
    fieldCodeHeight: 'data-testid form-elements-editor field-code-height',
    fieldOption: (optionId: string) => `data-testid form-elements-editor field-option-${optionId}`,
    fieldOptionType: 'form-elements-editor field-option-type',
    fieldOptionValue: 'data-testid form-elements-editor field-option-value',
    fieldOptionNumberValue: 'data-testid form-elements-editor field-option-number-value',
    fieldOptionLabel: 'data-testid form-elements-editor field-option-label',
    newElementId: 'data-testid form-elements-editor new-element-id',
    newElementLabel: 'data-testid form-elements-editor new-element-label',
    newElementType: 'form-elements-editor new-element-type',
    radioOption: (name: string) => `form-elements-editor option-${name}`,
    buttonSaveChanges: 'data-testid form-elements-editor button-save-changes',
    addElementError: 'data-testid form-elements-editor add-element-error',
  },
  headerParametersEditor: {
    root: 'data-testid header-parameters-editor',
    parameter: (name: string) => `data-testid header-parameters-editor root parameter-${name}`,
    fieldName: 'data-testid header-parameters-editor field-name',
    fieldValue: 'data-testid header-parameters-editor field-value',
    buttonRemove: 'data-testid header-parameters-editor button-remove',
    buttonAdd: 'data-testid header-parameters-editor button-add',
  },
  layoutSectionsEditor: {
    root: 'data-testid layout-sections-editor',
    section: (name: string) => `data-testid layout-sections-editor section-${name}`,
    fieldName: 'data-testid layout-sections-editor field-name',
    buttonAdd: 'data-testid layout-sections-editor button-add',
    buttonRemove: 'data-testid layout-sections-editor button-remove',
  },
};
