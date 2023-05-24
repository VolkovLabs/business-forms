import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { CodeLanguage, FormElementDefault, FormElementType, SliderDefault } from '../../constants';
import { getFormElementsEditorSelectors } from '../../test-utils';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  /**
   * Mock Select component
   */
  Select: jest.fn().mockImplementation(({ options, onChange, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

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
   * Open Element
   * @param elementId
   */
  const openElement = (elementId: string): ReturnType<typeof getFormElementsEditorSelectors> => {
    /**
     * Check element presence
     */
    expect(selectors.sectionLabel(false, elementId)).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, elementId));

    /**
     * Check if element content exists
     */
    const elementContent = selectors.sectionContent(false, elementId);
    expect(elementContent).toBeInTheDocument();

    /**
     * Return selectors for opened element
     */
    return getFormElementsEditorSelectors(within(elementContent));
  };

  /**
   * New Element
   */
  describe('New Element', () => {
    it('Should find component with new Element', () => {
      render(getComponent({ value: [], onChange }));
      expect(selectors.root()).toBeInTheDocument();

      expect(selectors.sectionNewLabel()).toBeInTheDocument();
      expect(selectors.sectionNewContent()).toBeInTheDocument();
      expect(selectors.newElementId()).toBeInTheDocument();
      expect(selectors.newElementLabel()).toBeInTheDocument();
      expect(selectors.newElementType()).toBeInTheDocument();
    });

    it('Should add new element and reset form', async () => {
      let elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));
      const { rerender } = render(getComponent({ value: elements, onChange }));

      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, 'newId')).not.toBeInTheDocument();

      /**
       * Check if empty element can't be created
       */
      expect(selectors.buttonAddElement()).toBeDisabled();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: 'newId' } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Id' } });
      fireEvent.change(selectors.newElementType(), { target: { value: FormElementType.STRING } });

      /**
       * Check if new element can be created
       */
      expect(selectors.buttonAddElement()).not.toBeDisabled();

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      rerender(getComponent({ value: elements, onChange }));
      expect(selectors.sectionLabel(false, 'newId')).toBeInTheDocument();

      /**
       * Check if form was reset
       */
      expect(selectors.newElementId()).toHaveValue('');
      expect(selectors.newElementLabel()).toHaveValue('');
      expect(selectors.newElementType()).toHaveValue(undefined);
    });

    it('Should add Slider element with default parameters', async () => {
      let elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));
      const { rerender } = render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Slider' } });
      fireEvent.change(selectors.newElementType(), { target: { value: FormElementType.SLIDER } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      rerender(getComponent({ value: elements, onChange }));

      const elementSelectors = openElement(newElementId);

      expect(elementSelectors.fieldSliderStep()).toHaveValue(SliderDefault.step);
      expect(elementSelectors.fieldSliderMin()).toHaveValue(SliderDefault.min);
      expect(elementSelectors.fieldSliderMax()).toHaveValue(SliderDefault.max);
    });
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
    const elementSelectors = openElement('id');

    expect(elementSelectors.fieldId()).toBeInTheDocument();
    expect(elementSelectors.fieldWidth()).toBeInTheDocument();
    expect(elementSelectors.fieldLabel()).toBeInTheDocument();
    expect(elementSelectors.fieldLabelWidth()).toBeInTheDocument();
    expect(elementSelectors.fieldTooltip()).toBeInTheDocument();
    expect(elementSelectors.fieldUnit()).toBeInTheDocument();
    expect(elementSelectors.buttonRemoveElement()).toBeInTheDocument();
  });

  /**
   * No Elements
   */
  it('Should find component without elements', () => {
    render(getComponent({ value: null, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(true, '123')).not.toBeInTheDocument();
  });

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
    const elementSelectors = openElement('slider');

    expect(elementSelectors.fieldSliderMin()).toBeInTheDocument();
    expect(elementSelectors.fieldSliderMax()).toBeInTheDocument();
    expect(elementSelectors.fieldSliderStep()).toBeInTheDocument();
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
    const elementSelectors = openElement('number');

    expect(elementSelectors.fieldNumberMin()).toBeInTheDocument();
    expect(elementSelectors.fieldNumberMax()).toBeInTheDocument();
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
    const elementSelectors = openElement('textarea');

    expect(elementSelectors.fieldTextareaRows()).toBeInTheDocument();
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
    const elementSelectors = openElement('code');

    expect(elementSelectors.fieldCodeLanguage()).toBeInTheDocument();
    expect(elementSelectors.fieldCodeHeight()).toBeInTheDocument();
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
    const elementSelectors = openElement('select');

    expect(elementSelectors.fieldType()).toBeInTheDocument();
    expect(elementSelectors.fieldOptionType()).toBeInTheDocument();
    expect(elementSelectors.fieldOptionLabel()).toBeInTheDocument();
    expect(elementSelectors.buttonRemoveOption()).toBeInTheDocument();
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

  /**
   * Remove element
   */
  it('Should remove element', () => {
    let elements = [
      { ...FormElementDefault, id: 'number' },
      { id: 'text', textarea: FormElementType.TEXTAREA },
    ];
    const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

    const { rerender } = render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'text')).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'number')).toBeInTheDocument();

    /**
     * Open text section
     */
    const elementSelectors = openElement('text');
    expect(elementSelectors.buttonRemoveElement()).toBeInTheDocument();

    /**
     * Remove text section
     */
    fireEvent.click(elementSelectors.buttonRemoveElement());
    rerender(getComponent({ value: elements, onChange }));

    /**
     * Check if section is removed
     */
    expect(selectors.sectionLabel(true, 'text')).not.toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'number')).toBeInTheDocument();
  });

  /**
   * Element order
   */
  describe('Element order', () => {
    it('Should move element up', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', textarea: FormElementType.TEXTAREA };
      let elements = [elementString, elementTextarea];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

      render(getComponent({ value: elements, onChange }));

      /**
       * Move element up
       */
      fireEvent.click(selectors.buttonMoveElementUp(false, elementTextarea.id));

      /**
       * Check if elements order is changed
       */
      expect(elements).toEqual([elementTextarea, elementString]);
    });

    it('Should move element down', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', textarea: FormElementType.TEXTAREA };
      let elements = [elementString, elementTextarea];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

      render(getComponent({ value: elements, onChange }));

      /**
       * Move element up
       */
      fireEvent.click(selectors.buttonMoveElementDown(false, elementString.id));

      /**
       * Check if elements order is changed
       */
      expect(elements).toEqual([elementTextarea, elementString]);
    });

    it('Should not be able to move first element up', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', textarea: FormElementType.TEXTAREA };
      const elements = [elementString, elementTextarea];

      render(getComponent({ value: elements, onChange }));

      expect(selectors.buttonMoveElementUp(true, elementString.id)).not.toBeInTheDocument();
    });

    it('Should not be able to move last element down', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', textarea: FormElementType.TEXTAREA };
      const elements = [elementString, elementTextarea];

      render(getComponent({ value: elements, onChange }));

      expect(selectors.buttonMoveElementDown(true, elementTextarea.id)).not.toBeInTheDocument();
    });
  });

  /**
   * Fields interaction
   */
  describe('Fields interaction', () => {
    it('Should update Id', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change id
       */
      fireEvent.change(elementSelectors.fieldId(), { target: { value: '123' } });
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '123',
          }),
        ])
      );
    });

    it('Should update hidden', () => {
      const elements = [{ ...FormElementDefault, id: 'id', hidden: false }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(within(elementSelectors.fieldVisibility()));
      expect(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')).toBeInTheDocument();

      fireEvent.click(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden'));

      /**
       * Check element updates
       */
      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            hidden: true,
          }),
        ])
      );
    });

    it('Should update Type', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.STRING }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change type
       */
      fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.NUMBER } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: FormElementType.NUMBER,
          }),
        ])
      );
    });

    it('Should set default Slider options if NewType=SLIDER', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.STRING }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change type
       */
      fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.SLIDER } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: FormElementType.SLIDER,
            min: SliderDefault.min,
            max: SliderDefault.max,
            step: SliderDefault.step,
            value: SliderDefault.value,
          }),
        ])
      );
    });

    it('Should update Width', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change width
       */
      fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            width: 123,
          }),
        ])
      );
    });

    it('Should update Label', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change label
       */
      fireEvent.change(elementSelectors.fieldLabel(), { target: { value: 'new label' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'new label',
          }),
        ])
      );
    });

    it('Should update Label Width', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change labelWidth
       */
      fireEvent.change(elementSelectors.fieldLabelWidth(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            labelWidth: 123,
          }),
        ])
      );
    });

    it('Should update Tooltip', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change tooltip
       */
      fireEvent.change(elementSelectors.fieldTooltip(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            tooltip: '123',
          }),
        ])
      );
    });

    it('Should update Unit', () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change tooltip
       */
      fireEvent.change(elementSelectors.fieldUnit(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            unit: '123',
          }),
        ])
      );
    });

    it('Should update Slider Min', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.SLIDER }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change slider min
       */
      fireEvent.change(elementSelectors.fieldSliderMin(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            min: 123,
          }),
        ])
      );
    });

    it('Should update Slider Max', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.SLIDER }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change slider max
       */
      fireEvent.change(elementSelectors.fieldSliderMax(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            max: 123,
          }),
        ])
      );
    });

    it('Should update Slider Step', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.SLIDER }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change step
       */
      fireEvent.change(elementSelectors.fieldSliderStep(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            step: 123,
          }),
        ])
      );
    });

    it('Should update Number Min', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.NUMBER }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change number min
       */
      fireEvent.change(elementSelectors.fieldNumberMin(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            min: 123,
          }),
        ])
      );
    });

    it('Should update Number Max', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.NUMBER }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change number max
       */
      fireEvent.change(elementSelectors.fieldNumberMax(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            max: 123,
          }),
        ])
      );
    });

    it('Should update Code Language', () => {
      const elements = [
        { ...FormElementDefault, id: 'id', type: FormElementType.CODE, language: CodeLanguage.JAVASCRIPT },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change code language
       */
      fireEvent.change(elementSelectors.fieldCodeLanguage(), { target: { value: CodeLanguage.JSON } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            language: CodeLanguage.JSON,
          }),
        ])
      );
    });

    it('Should update Code Height', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.CODE, height: 100 }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change code language
       */
      fireEvent.change(elementSelectors.fieldCodeHeight(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            height: 123,
          }),
        ])
      );
    });

    it('Should update Textarea rows', () => {
      const elements = [{ ...FormElementDefault, id: 'id', type: FormElementType.TEXTAREA }];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change number max
       */
      fireEvent.change(elementSelectors.fieldTextareaRows(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            rows: 123,
          }),
        ])
      );
    });
  });

  /**
   * Options
   */
  describe('Options', () => {
    it('Should add option to element', () => {
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
        },
      ];
      const onChange = jest.fn();
      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Add option
       */
      fireEvent.click(elementSelectors.buttonAddOption());

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                label: '',
                value: '',
              }),
            ]),
          }),
        ])
      );
    });

    it('Should add option to existing element options', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.NUMBER };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();
      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Add option
       */
      fireEvent.click(elementSelectors.buttonAddOption());

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                label: '',
                value: '',
              }),
            ]),
          }),
        ])
      );
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([originalOption]),
          }),
        ])
      );
    });

    it('Should update option type', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.STRING };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Change option type
       */
      fireEvent.change(elementSelectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                type: FormElementType.NUMBER,
              }),
            ]),
          }),
        ])
      );
    });

    it('Should update option value for STRING option', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.STRING };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Change option value
       */
      fireEvent.change(elementSelectors.fieldOptionValue(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                value: '123',
              }),
            ]),
          }),
        ])
      );
    });

    it('Should update option value for Number option', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.NUMBER };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Change option number value
       */
      fireEvent.change(elementSelectors.fieldOptionNumberValue(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                value: 123,
              }),
            ]),
          }),
        ])
      );
    });

    it('Should update option label', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.NUMBER };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Change option label
       */
      fireEvent.change(elementSelectors.fieldOptionLabel(), { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({
                label: '123',
              }),
            ]),
          }),
        ])
      );
    });

    it('Should remove option', () => {
      const originalOption = { id: 'id', label: 'label', type: FormElementType.NUMBER };
      const elements = [
        {
          ...FormElementDefault,
          id: 'select',
          type: FormElementType.SELECT,
          options: [originalOption],
        },
      ];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement('select');

      /**
       * Remove option
       */
      fireEvent.click(elementSelectors.buttonRemoveOption());

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            options: [],
          }),
        ])
      );
    });
  });

  /**
   * Layout Section
   */
  describe('Layout Section', () => {
    const sections = [{ name: 'section' }, { name: 'section 2' }];
    const elements = [
      {
        ...FormElementDefault,
        id: 'id',
      },
    ];

    it('Should render layout section', () => {
      render(getComponent({ value: elements, onChange, context: { options: { layout: { sections } } } }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Check section field presence
       */
      expect(elementSelectors.fieldSection()).toBeInTheDocument();
    });

    it('Should update section for element', () => {
      render(getComponent({ value: elements, onChange, context: { options: { layout: { sections } } } }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id');

      /**
       * Change section
       */
      fireEvent.change(elementSelectors.fieldSection(), { target: { value: sections[1].name } });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            section: sections[1].name,
          }),
        ])
      );
    });
  });
});
