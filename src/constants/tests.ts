import { selectors } from '@grafana/e2e-selectors';

/**
 * Tests Identifiers
 */
export const TestIds = {
  panel: {
    root: 'data-testid panel',
    infoMessage: 'data-testid panel info-message',
  },
  customCodeEditor: {
    root: 'data-testid custom-code-editor',
  },
  formElements: {
    root: 'data-testid form-elements',
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
     * https://github.com/grafana/grafana/blob/6a12673f8b0e07bc2aeeed70defc461fdf93bca8/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx#L97
     */
    fieldDateTime: 'date-time-picker',
    fieldSliderContainer: 'data-testid form-elements field-slider-container',
    fieldSliderInput: 'data-testid form-elements field-slider-input',
    fieldRadioContainer: 'data-testid form-elements field-radio-container',
    fieldSelectContainer: 'data-testid form-elements field-select-container',
  },
  formElementsEditor: {
    root: 'data-testid form-elements-editor',
    sectionLabel: (sectionId: string) => `data-testid form-elements-editor section-label-${sectionId}`,
    sectionContent: (sectionId: string) => `data-testid form-elements-editor section-content-${sectionId}`,
    sectionNewLabel: 'data-testid form-elements-editor section-new-label',
    sectionNewContent: 'data-testid form-elements-editor section-new-content',
    buttonMoveElementUp: 'data-testid form-elements-editor button-move-element-up',
    buttonMoveElementDown: 'data-testid form-elements-editor button-move-element-down',
    buttonRemoveElement: 'data-testid form-elements-editor button-remove-element',
    buttonAddElement: 'data-testid form-elements-editor button-add-element',
    buttonRemoveOption: 'data-testid form-elements-editor button-remove-option',
    buttonAddOption: 'data-testid form-elements-editor button-add-option',
    fieldId: 'data-testid form-elements-editor field-id',
    fieldVisibility: 'data-testid form-elements-editor field-visibility',
    fieldType: 'data-testid form-elements-editor field-type',
    fieldWidth: 'data-testid form-elements-editor field-width',
    fieldLabel: 'data-testid form-elements-editor field-label',
    fieldLabelWidth: 'data-testid form-elements-editor field-label-width',
    fieldTooltip: 'data-testid form-elements-editor field-tooltip',
    fieldUnit: 'data-testid form-elements-editor field-unit',
    fieldSection: 'data-testid form-elements-editor field-section',
    fieldSliderMin: 'data-testid form-elements-editor field-slider-min',
    fieldSliderMax: 'data-testid form-elements-editor field-slider-max',
    fieldSliderStep: 'data-testid form-elements-editor field-slider-step',
    fieldNumberMin: 'data-testid form-elements-editor field-number-min',
    fieldNumberMax: 'data-testid form-elements-editor field-number-max',
    fieldTextareaRows: 'data-testid form-elements-editor field-textarea-rows',
    fieldCodeLanguage: 'data-testid form-elements-editor field-code-language',
    fieldCodeHeight: 'data-testid form-elements-editor field-code-height',
    fieldOption: (optionId: string) => `data-testid form-elements-editor field-option-${optionId}`,
    fieldOptionType: 'data-testid form-elements-editor field-option-type',
    fieldOptionValue: 'data-testid form-elements-editor field-option-value',
    fieldOptionNumberValue: 'data-testid form-elements-editor field-option-number-value',
    fieldOptionLabel: 'data-testid form-elements-editor field-option-label',
    newElementId: 'data-testid form-elements-editor new-element-id',
    newElementLabel: 'data-testid form-elements-editor new-element-label',
    newElementType: 'data-testid form-elements-editor new-element-type',
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
