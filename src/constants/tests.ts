import { selectors } from '@grafana/e2e-selectors';

/**
 * Tests Identifiers
 */
export const TEST_IDS = {
  panel: {
    root: 'data-testid panel',
    loadingBar: 'data-testid panel loading-bar',
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
    resetConfirmModal: 'data-testid panel reset-confirm-modal',
    buttonConfirmReset: selectors.pages.ConfirmModal.delete,
  },
  customCodeEditor: {
    root: 'data-testid custom-code-editor',
  },
  formElements: {
    root: 'data-testid form-elements',
    element: (elementId: string, elementType: string) =>
      `data-testid form-elements element-${elementId}-${elementType}`,
    default: 'data-testid form-elements default-none',
    fieldNumber: 'data-testid form-elements field-number',
    fieldString: 'data-testid form-elements field-string',
    fieldFile: 'data-testid form-elements field-file',
    fieldColorPicker: 'data-testid form-elements field-color-picker',
    fieldPassword: 'data-testid form-elements field-password',
    fieldDisabled: 'data-testid form-elements field-disabled',
    fieldTextarea: 'data-testid form-elements field-textarea',
    fieldDisabledTextarea: 'data-testid form-elements field-disabled-textarea',
    fieldCode: 'Code editor container',
    fieldBooleanContainer: 'data-testid form-elements field-boolean-container',
    /**
     * We should use default value for date-time-picker without data-testid prefix
     * https://github.com/grafana/grafana/blob/6a12673f8b0e07bc2aeeed70defc461fdf93bca8/packages/grafana-ui/src/components/DateTimePickers/DateTimePicker/DateTimePicker.tsx#LL229C24-L229C39
     */
    fieldDateTime: 'date-time-input',
    fieldDate: 'data-testid form-elements field-date',
    fieldTime: 'data-testid form-elements field-time',
    fieldSlider: 'form-elements field-slider',
    fieldSliderInput: 'data-testid form-elements field-slider-input',
    fieldRadioContainer: 'data-testid form-elements field-radio-container',
    fieldCheckboxListContainer: 'data-testid form-elements field-checkboxList-container',
    fieldSelect: 'form-elements field-select-container',
    fieldCustomButtonContainer: 'data-testid form-elements field-custom-button-container',
    fieldCustomButton: (id: string) => `data-testid form-elements field-custom-button-${id}`,
    booleanOption: (name: string) => `form-elements boolean-${name}`,
    unit: 'data-testid form-elements unit',
    link: 'data-testid form elements link',
  },
  formElementsEditor: {
    addElementError: 'data-testid form-elements-editor add-element-error',
    buttonAddElement: 'data-testid form-elements-editor button-add-element',
    buttonAddOption: 'data-testid form-elements-editor button-add-option',
    buttonRemoveElement: 'data-testid form-elements-editor button-remove-element',
    buttonRemoveOption: 'data-testid form-elements-editor button-remove-option',
    buttonRemoveBackground: 'data-testid form-elements-editor button-remove-background',
    buttonRemoveLabelBackground: 'data-testid form-elements-editor button-remove-label-background',
    buttonRemoveLabelColor: 'data-testid form-elements-editor button-remove-label-color',
    buttonSaveChanges: 'data-testid form-elements-editor button-save-changes',
    fieldCodeHeight: 'data-testid form-elements-editor field-code-height',
    fieldCodeLanguage: 'form-elements-editor field-code-language',
    fieldId: 'data-testid form-elements-editor field-id',
    fieldLabel: 'data-testid form-elements-editor field-label',
    fieldLabelWidth: 'data-testid form-elements-editor field-label-width',
    fieldNumberMax: 'data-testid form-elements-editor field-number-max',
    fieldNumberMin: 'data-testid form-elements-editor field-number-min',
    options: 'data-testid form-elements-editor options',
    optionLabel: (value: unknown) => `data-testid form-elements-editor option-label-${value}`,
    optionContent: (value: unknown) => `data-testid form-elements-editor option-content-${value}`,
    fieldOptionLabel: 'data-testid form-elements-editor field-option-label',
    fieldOptionIcon: 'form-elements-editor field-option-icon',
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
    fieldDisableIf: 'form-elements-editor field-disable-if',
    fieldUnit: 'data-testid form-elements-editor field-unit',
    fieldVisibility: 'data-testid form-elements-editor field-visibility',
    fieldTimeZone: 'data-testid form-elements-editor field-time-zone',
    fieldWidth: 'data-testid form-elements-editor field-width',
    fieldElementBackground: 'data-testid form-elements-editor field-element-background',
    fieldLabelBackground: 'data-testid form-elements-editor field-label-background',
    fieldLabelColor: 'data-testid form-elements-editor field-label-color',
    fieldNamePicker: 'data-testid form-elements-editor field-name-picker',
    fieldAccept: 'data-testid form-elements-editor field-accept',
    fieldFromQueryPicker: 'form-elements-editor field-from-query-picker',
    fieldDateTime: 'date-time-input',
    fieldMinDate: 'data-testid form-elements-editor field-min-date',
    fieldMaxDate: 'data-testid form-elements-editor field-max-date',
    fieldCustomButtonIcon: 'data-testid form-elements-editor field-custom-button-icon',
    fieldCustomButtonForeground: 'data-testid form-elements-editor field-custom-button-foreground',
    fieldCustomButtonBackground: 'data-testid form-elements-editor field-custom-button-background',
    fieldCustomButtonCustomCode: 'form-elements-editor field-custom-button-custom-code',
    fieldCustomButtonSize: 'data-testid form-elements-editor field-custom-button-size',
    fieldCustomButtonPlace: 'data-testid form-elements-editor field-custom-button-place',
    fieldCustomButtonVariant: 'data-testid form-elements-editor field-custom-button-variant',
    fieldCustomButtonLabel: 'data-testid form-elements-editor field-custom-button-label',
    customButtonSizeOption: (name: string) => `form-elements-editor custom-button-size-option-${name}`,
    customButtonPlaceOption: (name: string) => `form-elements-editor custom-button-place-option-${name}`,
    customButtonVariantOption: (name: string) => `form-elements-editor custom-button-varian-option-${name}`,
    optionsSourceOption: (value: unknown) => `form-elements-editor options-source-option-${value}`,
    linkTargetOption: (value: unknown) => `form-elements-editor link-target-option-${value}`,
    fieldQueryOptionsValue: 'form-elements-editor field-query-options-value',
    fieldQueryOptionsLabel: 'form-elements-editor field-query-options-label',
    newElementId: 'data-testid form-elements-editor new-element-id',
    newElementLabel: 'data-testid form-elements-editor new-element-label',
    newElementType: 'form-elements-editor new-element-type',
    radioOption: (name: string) => `form-elements-editor option-${name}`,
    timeTransformationOption: (name: string) => `form-elements-editor time-option-${name}`,
    root: 'data-testid form-elements-editor',
    sectionContent: (id: string, type: string) => `data-testid form-elements-editor section-content-${id}-${type}`,
    sectionLabel: (id: string, type: string) => `data-testid form-elements-editor section-label-${id}-${type}`,
    sectionNewContent: 'data-testid form-elements-editor section-new-content',
    sectionNewLabel: 'data-testid form-elements-editor section-new-label',
    buttonSetDate: 'data-testid form-elements-editor button-set-date',
    buttonRemoveDate: 'data-testid form-elements-editor button-remove-date',
    fieldLinkText: 'data-testid form-elements-editor field-link-text',
    fieldGetOptions: 'form-elements-editor field-get-options',
    fileMultipleOption: (name: unknown) => `form-elements-editor file-multiple-option-${name}`,
    optionsCustomValues: (value: unknown) => `form-elements-editor options-source-option-${value}`,
    optionsColorFormat: (value: unknown) => `form-elements-editor options-color-format-option-${value}`,
  },
  formElementsSection: {
    sectionContent: (id: string, name: string) => `data-testid form-elements-section section-content-${id}-${name}`,
    sectionHeader: (id: string, name: string) => `data-testid form-elements-section section-header-${id}-${name}`,
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
    fieldId: 'data-testid layout-sections-editor field-id',
    fieldName: 'data-testid layout-sections-editor field-name',
    fieldExpanded: 'layout-sections-editor field-expanded',
    root: 'data-testid layout-sections-editor',
    section: (name: string) => `data-testid layout-sections-editor section-${name}`,
  },
  initialFieldsEditor: {
    root: 'data-testid initial-fields-editor',
    buttonSaveChanges: 'data-testid initial-fields-editor button-save-changes',
    fieldNamePicker: 'data-testid initial-fields-editor field-name-picker',
    fieldFromQueryPicker: 'data-testid initial-fields-editor field-from-query-picker',
  },
};
