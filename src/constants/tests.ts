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
    buttonSaveDefault: 'data-testid panel button-save-default',
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
    addElementError: 'data-testid form-elements-editor add-element-error',
    buttonAddElement: 'data-testid form-elements-editor button-add-element',
    buttonAddOption: 'data-testid form-elements-editor button-add-option',
    buttonRemoveElement: 'data-testid form-elements-editor button-remove-element',
    buttonRemoveOption: 'data-testid form-elements-editor button-remove-option',
    buttonSaveChanges: 'data-testid form-elements-editor button-save-changes',
    fieldCodeHeight: 'data-testid form-elements-editor field-code-height',
    fieldCodeLanguage: 'form-elements-editor field-code-language',
    fieldId: 'data-testid form-elements-editor field-id',
    fieldLabel: 'data-testid form-elements-editor field-label',
    fieldLabelWidth: 'data-testid form-elements-editor field-label-width',
    fieldNumberMax: 'data-testid form-elements-editor field-number-max',
    fieldNumberMin: 'data-testid form-elements-editor field-number-min',
    fieldOption: (optionId: string) => `data-testid form-elements-editor field-option-${optionId}`,
    fieldOptionLabel: 'data-testid form-elements-editor field-option-label',
    fieldOptionNumberValue: 'data-testid form-elements-editor field-option-number-value',
    fieldOptionType: 'form-elements-editor field-option-type',
    fieldOptionValue: 'data-testid form-elements-editor field-option-value',
    fieldSection: 'form-elements-editor field-section',
    fieldSliderMax: 'data-testid form-elements-editor field-slider-max',
    fieldSliderMin: 'data-testid form-elements-editor field-slider-min',
    fieldSliderStep: 'data-testid form-elements-editor field-slider-step',
    fieldTextareaRows: 'data-testid form-elements-editor field-textarea-rows',
    fieldTooltip: 'data-testid form-elements-editor field-tooltip',
    fieldType: 'form-elements-editor field-type',
    fieldShowIf: 'form-elements-editor field-show-if',
    fieldUnit: 'data-testid form-elements-editor field-unit',
    fieldVisibility: 'data-testid form-elements-editor field-visibility',
    fieldWidth: 'data-testid form-elements-editor field-width',
    fieldNamePicker: 'data-testid form-elements-editor field-name-picker',
    fieldFromQueryPicker: 'form-elements-editor field-from-query-picker',
    fieldDateTime: 'date-time-input',
    fieldMinDate: 'data-testid form-elements-editor field-min-date',
    fieldMaxDate: 'data-testid form-elements-editor field-max-date',
    newElementId: 'data-testid form-elements-editor new-element-id',
    newElementLabel: 'data-testid form-elements-editor new-element-label',
    newElementType: 'form-elements-editor new-element-type',
    radioOption: (name: string) => `form-elements-editor option-${name}`,
    root: 'data-testid form-elements-editor',
    sectionContent: (id: string, type: string) => `data-testid form-elements-editor section-content-${id}-${type}`,
    sectionLabel: (id: string, type: string) => `data-testid form-elements-editor section-label-${id}-${type}`,
    sectionNewContent: 'data-testid form-elements-editor section-new-content',
    sectionNewLabel: 'data-testid form-elements-editor section-new-label',
    buttonSetDate: 'data-testid form-elements-editor button-set-date',
    buttonRemoveDate: 'data-testid form-elements-editor button-remove-date',
  },
  headerParametersEditor: {
    buttonAdd: 'data-testid header-parameters-editor button-add',
    buttonRemove: 'data-testid header-parameters-editor button-remove',
    fieldName: 'data-testid header-parameters-editor field-name',
    fieldValue: 'data-testid header-parameters-editor field-value',
    parameter: (name: string) => `data-testid header-parameters-editor root parameter-${name}`,
    root: 'data-testid header-parameters-editor',
  },
  layoutSectionsEditor: {
    buttonAdd: 'data-testid layout-sections-editor button-add',
    buttonRemove: 'data-testid layout-sections-editor button-remove',
    fieldName: 'data-testid layout-sections-editor field-name',
    root: 'data-testid layout-sections-editor',
    section: (name: string) => `data-testid layout-sections-editor section-${name}`,
  },
  datasourceEditor: {
    fieldSelect: 'select-datasource-editor field-select',
  },
};
