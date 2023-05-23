import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { FormElementDefault, FormElementType } from '../../constants';
import { getFormElementsEditorSelectors } from '../../test-utils';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Form Elements Editor
 */
describe('Form Elements Editor', () => {
  const onChange = jest.fn();

  /**
   * Form Elements Editor Selectors
   */
  const selectors = getFormElementsEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
    return <FormElementsEditor {...restProps} value={value} context={context} />;
  };

  /**
   * New Element
   */
  it('Should find component with new Element', () => {
    render(getComponent({ value: [], onChange }));
    expect(selectors.root()).toBeInTheDocument();

    expect(selectors.sectionNewLabel()).toBeInTheDocument();
    expect(selectors.sectionNewContent()).toBeInTheDocument();
    expect(selectors.newElementId()).toBeInTheDocument();
    expect(selectors.newElementLabel()).toBeInTheDocument();
    expect(selectors.newElementType()).toBeInTheDocument();
  });

  /**
   * Id Element
   */
  it('Should find component with Id Element', () => {
    const elements = [{ ...FormElementDefault, id: 'id' }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'id')).toBeInTheDocument();
    expect(selectors.sectionContent(true, 'id')).not.toBeInTheDocument();

    /**
     * Make Id Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'id'));

    const idSection = selectors.sectionContent(false, 'id');
    expect(idSection).toBeInTheDocument();
    const idSectionSelectors = getFormElementsEditorSelectors(within(idSection));
    expect(idSectionSelectors.fieldId()).toBeInTheDocument();
    expect(idSectionSelectors.fieldWidth()).toBeInTheDocument();
    expect(idSectionSelectors.fieldLabel()).toBeInTheDocument();
    expect(idSectionSelectors.fieldLabelWidth()).toBeInTheDocument();
    expect(idSectionSelectors.fieldTooltip()).toBeInTheDocument();
    expect(idSectionSelectors.fieldUnit()).toBeInTheDocument();
    expect(idSectionSelectors.buttonRemoveElement()).toBeInTheDocument();
  });

  /**
   * No Elements
   */
  it('Should find component without elements', () => {
    render(getComponent({ value: null, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(true, '123')).not.toBeInTheDocument();
  });
  //
  /**
   * Slider
   */
  it('Should find component with Slider', () => {
    const elements = [{ ...FormElementDefault, id: 'slider', type: FormElementType.SLIDER }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Slider Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'slider'));

    const sliderSection = selectors.sectionContent(false, 'slider');
    expect(sliderSection).toBeInTheDocument();
    const sliderSectionSelectors = getFormElementsEditorSelectors(within(sliderSection));
    expect(sliderSectionSelectors.fieldSliderMin()).toBeInTheDocument();
    expect(sliderSectionSelectors.fieldSliderMax()).toBeInTheDocument();
    expect(sliderSectionSelectors.fieldSliderStep()).toBeInTheDocument();
  });

  /**
   * Number
   */
  it('Should find component with Number', () => {
    const elements = [{ ...FormElementDefault, id: 'number', type: FormElementType.NUMBER }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Number Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'number'));

    const numberSection = selectors.sectionContent(false, 'number');
    expect(numberSection).toBeInTheDocument();
    const numberSectionSelectors = getFormElementsEditorSelectors(within(numberSection));
    expect(numberSectionSelectors.fieldNumberMin()).toBeInTheDocument();
    expect(numberSectionSelectors.fieldNumberMax()).toBeInTheDocument();
  });

  /**
   * TextArea
   */
  it('Should find component with TextArea', () => {
    const elements = [{ ...FormElementDefault, id: 'textarea', type: FormElementType.TEXTAREA }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Textarea Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'textarea'));

    const textareaSection = selectors.sectionContent(false, 'textarea');
    expect(textareaSection).toBeInTheDocument();
    const textareaSectionSelectors = getFormElementsEditorSelectors(within(textareaSection));
    expect(textareaSectionSelectors.fieldTextareaRows()).toBeInTheDocument();
  });

  /**
   * Code Editor
   */
  it('Should find component with Code Editor', () => {
    const elements = [{ ...FormElementDefault, id: 'code', type: FormElementType.CODE }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Code Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'code'));

    const codeSection = selectors.sectionContent(false, 'code');
    expect(codeSection).toBeInTheDocument();
    const codeSectionSelectors = getFormElementsEditorSelectors(within(codeSection));
    expect(codeSectionSelectors.fieldCodeLanguage()).toBeInTheDocument();
    expect(codeSectionSelectors.fieldCodeHeight()).toBeInTheDocument();
  });

  /**
   * Select
   */
  it('Should find component with Select', () => {
    const elements = [
      {
        ...FormElementDefault,
        id: 'select',
        type: FormElementType.SELECT,
        options: [{ id: 'id', label: 'label', type: FormElementType.NUMBER }],
      },
    ];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, 'select'));

    const selectSection = selectors.sectionContent(false, 'select');
    expect(selectSection).toBeInTheDocument();
    const selectSectionSelectors = getFormElementsEditorSelectors(within(selectSection));
    expect(selectSectionSelectors.fieldType()).toBeInTheDocument();
    expect(selectSectionSelectors.fieldOptionType()).toBeInTheDocument();
    expect(selectSectionSelectors.fieldOptionLabel()).toBeInTheDocument();
    expect(selectSectionSelectors.buttonRemoveOption()).toBeInTheDocument();
  });

  /**
   * Two elements
   */
  it('Should find component with Two Elements', () => {
    const elements = [
      { ...FormElementDefault, id: 'number' },
      { id: 'text', textarea: FormElementType.TEXTAREA },
    ];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'text')).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'number')).toBeInTheDocument();
  });
});
