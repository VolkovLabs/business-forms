import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import {
  CodeEditorHeight,
  CodeLanguage,
  FormElementDefault,
  FormElementType,
  NumberDefault,
  SliderDefault,
} from '../../constants';
import { getFormElementsEditorSelectors } from '../../utils';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  /**
   * Mock Select component
   */
  Select: jest.fn().mockImplementation(({ options, onChange, value, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      value={value?.value}
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
 * Mock timers
 */
jest.useFakeTimers();

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
   * @param elementType
   */
  const openElement = (elementId: string, elementType: string): ReturnType<typeof getFormElementsEditorSelectors> => {
    /**
     * Check element presence
     */
    expect(selectors.sectionLabel(false, elementId, elementType)).toBeInTheDocument();

    /**
     * Make Select Element is opened
     */
    fireEvent.click(selectors.sectionLabel(false, elementId, elementType));

    /**
     * Check if element content exists
     */
    const elementContent = selectors.sectionContent(false, elementId, elementType);
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
      const elements = [{ ...FormElementDefault, id: 'id' }];
      render(getComponent({ value: elements, onChange }));

      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, 'newId', FormElementType.STRING)).not.toBeInTheDocument();

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
      expect(selectors.sectionLabel(false, 'newId', FormElementType.STRING)).toBeInTheDocument();

      /**
       * Check if form was reset
       */
      expect(selectors.newElementId()).toHaveValue('');
      expect(selectors.newElementLabel()).toHaveValue('');
      expect(selectors.newElementType()).toHaveValue(undefined);
    });

    it('Should add Slider element with default parameters', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.SLIDER;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Slider' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */

      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldSliderStep()).toHaveValue(SliderDefault.step);
      expect(elementSelectors.fieldSliderMin()).toHaveValue(SliderDefault.min);
      expect(elementSelectors.fieldSliderMax()).toHaveValue(SliderDefault.max);
    });

    it('Should add Number element with default parameters', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.NUMBER;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Number' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldNumberMin()).toHaveValue(NumberDefault.min);
      expect(elementSelectors.fieldNumberMax()).toHaveValue(NumberDefault.max);
    });

    it('Should add Code element with default parameters', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'newSlider';
      const newElementType = FormElementType.CODE;
      /**
       * Check if section is missing
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).not.toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Code' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element exists
       */
      const elementSelectors = openElement(newElementId, newElementType);

      expect(elementSelectors.fieldCodeHeight()).toHaveValue(CodeEditorHeight);
      expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JAVASCRIPT);
    });

    it('Should not add element if element with the same id and type exists', async () => {
      const element = { ...FormElementDefault, id: 'id' };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      const newElementId = 'id';
      const newElementType = FormElementDefault.type;

      /**
       * Check if section exists
       */
      expect(selectors.sectionLabel(true, newElementId, newElementType)).toBeInTheDocument();

      /**
       * Fill new element form
       */
      fireEvent.change(selectors.newElementId(), { target: { value: newElementId } });
      fireEvent.change(selectors.newElementLabel(), { target: { value: 'New Code' } });
      fireEvent.change(selectors.newElementType(), { target: { value: newElementType } });

      /**
       * Create new element
       */
      fireEvent.click(selectors.buttonAddElement());

      /**
       * Check if new element are not added
       */
      expect(selectors.addElementError()).toBeInTheDocument();
      expect(selectors.buttonAddElement()).toBeDisabled();
      expect(selectors.newElementLabel()).toHaveValue('New Code');

      /**
       * Remove element conflict
       */
      fireEvent.change(selectors.newElementType(), { target: { value: FormElementType.NUMBER } });

      /**
       * Add element
       */
      expect(selectors.buttonAddElement()).not.toBeDisabled();
      fireEvent.click(selectors.buttonAddElement());

      expect(selectors.sectionLabel(false, newElementId, FormElementType.NUMBER)).toBeInTheDocument();
    });
  });

  /**
   * Id Element
   */
  it('Should find component with Id Element', () => {
    const elements = [{ ...FormElementDefault, id: 'id' }];

    render(getComponent({ value: elements, onChange }));
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, 'id', FormElementDefault.type)).toBeInTheDocument();
    expect(selectors.sectionContent(true, 'id', FormElementDefault.type)).not.toBeInTheDocument();

    /**
     * Make Id Element is opened
     */
    const elementSelectors = openElement('id', FormElementDefault.type);

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
    expect(selectors.sectionLabel(true, '123', '213')).not.toBeInTheDocument();
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
    const elementSelectors = openElement('slider', FormElementType.SLIDER);

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
    const elementSelectors = openElement('number', FormElementType.NUMBER);

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
    const elementSelectors = openElement('textarea', FormElementType.TEXTAREA);

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
    const elementSelectors = openElement('code', FormElementType.CODE);

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
    const elementSelectors = openElement('select', FormElementType.SELECT);

    expect(elementSelectors.fieldType()).toBeInTheDocument();
    expect(elementSelectors.fieldOptionType()).toBeInTheDocument();
    expect(elementSelectors.fieldOptionLabel()).toBeInTheDocument();
    expect(elementSelectors.buttonRemoveOption()).toBeInTheDocument();
  });

  /**
   * Two elements
   */
  it('Should find component with Two Elements', () => {
    const numberElement = { ...FormElementDefault, id: 'number' };
    const textElement = { id: 'text', type: FormElementType.TEXTAREA };
    const elements = [numberElement, textElement];

    render(getComponent({ value: elements, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, textElement.id, textElement.type)).toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();
  });

  /**
   * Remove element
   */
  it('Should remove element', () => {
    const numberElement = { ...FormElementDefault, id: 'number' };
    const textElement = { id: 'text', type: FormElementType.TEXTAREA };
    const elements = [numberElement, textElement];

    render(getComponent({ value: elements, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.sectionLabel(false, textElement.id, textElement.type)).toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();

    /**
     * Open text section
     */
    const elementSelectors = openElement(textElement.id, textElement.type);
    expect(elementSelectors.buttonRemoveElement()).toBeInTheDocument();

    /**
     * Remove text section
     */
    fireEvent.click(elementSelectors.buttonRemoveElement());

    /**
     * Check if section is removed
     */
    expect(selectors.sectionLabel(true, textElement.id, textElement.type)).not.toBeInTheDocument();
    expect(selectors.sectionLabel(false, numberElement.id, numberElement.type)).toBeInTheDocument();
  });

  /**
   * Element order
   */
  describe('Element order', () => {
    it('Should move element up', async () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA };
      let elements = [elementString, elementTextarea];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

      render(getComponent({ value: elements, onChange }));

      /**
       * Move element up
       */
      await act(() => fireEvent.click(selectors.buttonMoveElementUp(false, elementTextarea.id, elementTextarea.type)));

      /**
       * Save changes
       */
      fireEvent.click(selectors.buttonSaveChanges());

      /**
       * Check if elements order is changed
       */
      expect(elements).toEqual([elementTextarea, elementString]);
    });

    it('Should move element down', async () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA };
      let elements = [elementString, elementTextarea];
      const onChange = jest.fn().mockImplementation((updatedElements) => (elements = updatedElements));

      render(getComponent({ value: elements, onChange }));

      /**
       * Move element up
       */
      await act(() => fireEvent.click(selectors.buttonMoveElementDown(false, elementString.id, elementString.type)));

      /**
       * Save changes
       */
      fireEvent.click(selectors.buttonSaveChanges());

      /**
       * Check if elements order is changed
       */
      expect(elements).toEqual([elementTextarea, elementString]);
    });

    it('Should not be able to move first element up', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA };
      const elements = [elementString, elementTextarea];

      render(getComponent({ value: elements, onChange }));

      expect(selectors.buttonMoveElementUp(true, elementString.id, elementString.type)).not.toBeInTheDocument();
    });

    it('Should not be able to move last element down', () => {
      const elementString = { ...FormElementDefault, id: 'number' };
      const elementTextarea = { id: 'text', type: FormElementType.TEXTAREA };
      const elements = [elementString, elementTextarea];

      render(getComponent({ value: elements, onChange }));

      expect(selectors.buttonMoveElementDown(true, elementTextarea.id, elementTextarea.type)).not.toBeInTheDocument();
    });
  });

  /**
   * Fields interaction
   */
  describe('Fields interaction', () => {
    it('Should update Id', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change id
       */
      await act(() => fireEvent.change(elementSelectors.fieldId(), { target: { value: '123' } }));

      /**
       * Element with new id is still opened because key=index
       */
      expect(elementSelectors.fieldId()).toHaveValue('123');
    });

    it('Should update Hidden', async () => {
      const elements = [{ ...FormElementDefault, id: 'id', hidden: false }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Choose hidden option
       */
      const fieldVisibilitySelectors = getFormElementsEditorSelectors(within(elementSelectors.fieldVisibility()));
      expect(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')).toBeInTheDocument();

      await act(() => fireEvent.click(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')));

      expect(fieldVisibilitySelectors.radioOption(false, 'visibility-hidden')).toBeChecked();
    });

    it('Should update Type', async () => {
      const element = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change type
       */
      await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.NUMBER } }));

      expect(elementSelectors.fieldType()).toHaveValue(FormElementType.NUMBER);
    });

    it('Should not update Type if element with the same id and type exists', async () => {
      const elementOne = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
      const elementTwo = { ...FormElementDefault, id: 'id', type: FormElementType.NUMBER };
      const elements = [elementOne, elementTwo];
      jest.spyOn(window, 'alert').mockImplementationOnce(() => {});

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(elementTwo.id, elementTwo.type);

      /**
       * Change on already exist type
       */
      await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: elementOne.type } }));

      /**
       * Check if type is not updated because conflict
       */
      expect(selectors.sectionLabel(false, elementOne.id, elementOne.type)).toBeInTheDocument();
      expect(selectors.sectionLabel(false, elementTwo.id, elementTwo.type)).toBeInTheDocument();
    });

    it('Should update Width', async () => {
      const elements = [{ ...FormElementDefault, id: 'id', width: 100 }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change width
       */
      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '123' } }));

      expect(elementSelectors.fieldWidth()).toHaveValue(123);
    });

    it('Should update Label', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change label
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabel(), { target: { value: 'new label' } }));

      expect(elementSelectors.fieldLabel()).toHaveValue('new label');
    });

    it('Should update Label Width', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change labelWidth
       */
      await act(() => fireEvent.change(elementSelectors.fieldLabelWidth(), { target: { value: '123' } }));

      expect(elementSelectors.fieldLabelWidth()).toHaveValue(123);
    });

    it('Should update Tooltip', async () => {
      const elements = [{ ...FormElementDefault, id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change tooltip
       */
      await act(() => fireEvent.change(elementSelectors.fieldTooltip(), { target: { value: '123' } }));

      expect(elementSelectors.fieldTooltip()).toHaveValue('123');
    });

    it('Should update Unit', async () => {
      const elements = [{ ...FormElementDefault, unit: '', id: 'id' }];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change tooltip
       */
      await act(() => fireEvent.change(elementSelectors.fieldUnit(), { target: { value: '123' } }));

      expect(elementSelectors.fieldUnit()).toHaveValue('123');
    });

    it('Should update Slider Min', async () => {
      const element = { ...FormElementDefault, ...SliderDefault, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change slider min
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderMin(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderMin()).toHaveValue(123);
    });

    it('Should update Slider Max', async () => {
      const element = { ...FormElementDefault, ...SliderDefault, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change slider max
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderMax(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderMax()).toHaveValue(123);
    });

    it('Should update Slider Step', async () => {
      const element = { ...FormElementDefault, ...SliderDefault, id: 'id', type: FormElementType.SLIDER };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change step
       */
      await act(() => fireEvent.change(elementSelectors.fieldSliderStep(), { target: { value: '123' } }));

      expect(elementSelectors.fieldSliderStep()).toHaveValue(123);
    });

    it('Should update Number Min', async () => {
      const element = { ...FormElementDefault, ...NumberDefault, id: 'id', type: FormElementType.NUMBER };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change number min
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMin(), { target: { value: '123' } }));

      expect(elementSelectors.fieldNumberMin()).toHaveValue(123);

      /**
       * Clean number min value
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMin(), { target: { value: '' } }));

      expect(elementSelectors.fieldNumberMin()).toHaveDisplayValue('');

      /**
       * Check if empty number min is null
       */
      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            min: null,
          }),
        ])
      );
    });

    it('Should update Number Max', async () => {
      const element = { ...FormElementDefault, ...NumberDefault, id: 'id', type: FormElementType.NUMBER };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change number max
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMax(), { target: { value: '123' } }));

      expect(elementSelectors.fieldNumberMax()).toHaveValue(123);

      /**
       * Clean number max value
       */
      await act(() => fireEvent.change(elementSelectors.fieldNumberMax(), { target: { value: '' } }));

      expect(elementSelectors.fieldNumberMax()).toHaveDisplayValue('');

      /**
       * Check if empty number max is null
       */
      await act(() => fireEvent.click(selectors.buttonSaveChanges()));

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            max: null,
          }),
        ])
      );
    });

    it('Should update Code Language', async () => {
      const element = {
        ...FormElementDefault,
        id: 'id',
        type: FormElementType.CODE,
        language: CodeLanguage.JAVASCRIPT,
      };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change code language
       */
      await act(() => fireEvent.change(elementSelectors.fieldCodeLanguage(), { target: { value: CodeLanguage.JSON } }));

      expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JSON);
    });

    it('Should update Code Height', async () => {
      const element = { ...FormElementDefault, id: 'id', type: FormElementType.CODE, height: 100 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change code language
       */
      await act(() => fireEvent.change(elementSelectors.fieldCodeHeight(), { target: { value: '123' } }));

      expect(elementSelectors.fieldCodeHeight()).toHaveValue(123);
    });

    it('Should update Textarea rows', async () => {
      const element = { ...FormElementDefault, id: 'id', type: FormElementType.TEXTAREA, rows: 2 };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open id element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change textarea rows
       */
      await act(() => fireEvent.change(elementSelectors.fieldTextareaRows(), { target: { value: '123' } }));

      expect(elementSelectors.fieldTextareaRows()).toHaveValue(123);
    });

    describe('Apply default element options', () => {
      it('Should set default Slider options if NewType=SLIDER', async () => {
        const element = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.SLIDER } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.SLIDER);
        expect(elementSelectors.fieldSliderMin()).toHaveValue(SliderDefault.min);
        expect(elementSelectors.fieldSliderMax()).toHaveValue(SliderDefault.max);
        expect(elementSelectors.fieldSliderStep()).toHaveValue(SliderDefault.step);
      });

      it('Should set default Number options if NewType=NUMBER', async () => {
        const element = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.NUMBER } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.NUMBER);
        expect(elementSelectors.fieldNumberMin()).toHaveValue(NumberDefault.min);
        expect(elementSelectors.fieldNumberMax()).toHaveValue(NumberDefault.max);
      });

      it('Should set default Code options if NewType=CODE', async () => {
        const element = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() => fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.CODE } }));

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.CODE);
        expect(elementSelectors.fieldCodeLanguage()).toHaveValue(CodeLanguage.JAVASCRIPT);
        expect(elementSelectors.fieldCodeHeight()).toHaveValue(CodeEditorHeight);
      });

      it('Should set default Textarea options if NewType=TEXTAREA', async () => {
        const element = { ...FormElementDefault, id: 'id', type: FormElementType.STRING };
        const elements = [element];

        render(getComponent({ value: elements, onChange }));

        /**
         * Open id element
         */
        const elementSelectors = openElement(element.id, element.type);

        /**
         * Change type
         */
        await act(() =>
          fireEvent.change(elementSelectors.fieldType(), { target: { value: FormElementType.TEXTAREA } })
        );

        expect(elementSelectors.fieldType()).toHaveValue(FormElementType.TEXTAREA);
        expect(elementSelectors.fieldTextareaRows()).toHaveValue(10);
      });
    });
  });

  /**
   * Options
   */
  describe('Options', () => {
    it('Should add option to element', async () => {
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Add option
       */
      await act(() => fireEvent.click(elementSelectors.buttonAddOption()));

      const elementOption = elementSelectors.fieldOption(false, '');
      expect(elementOption).toBeInTheDocument();

      const elementOptionSelectors = getFormElementsEditorSelectors(within(elementOption));

      expect(elementOptionSelectors.fieldOptionLabel()).toHaveValue('');
      expect(elementOptionSelectors.fieldOptionValue()).toHaveValue('');
    });

    it('Should add option to existing element options', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: '111' };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Add option
       */
      await act(() => fireEvent.click(elementSelectors.buttonAddOption()));

      expect(elementSelectors.fieldOption(false, originalOption.value)).toBeInTheDocument();
      expect(elementSelectors.fieldOption(false, '')).toBeInTheDocument();
    });

    it('Should update option type', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111' };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change option type
       */
      await act(() =>
        fireEvent.change(elementSelectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } })
      );

      const elementOption = elementSelectors.fieldOption(false, originalOption.value);
      expect(elementOption).toBeInTheDocument();

      const elementOptionSelectors = getFormElementsEditorSelectors(within(elementOption));
      expect(elementOptionSelectors.fieldOptionType()).toHaveValue(FormElementType.NUMBER);
    });

    it('Should update option value for STRING option', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111' };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      await act(() => fireEvent.change(elementSelectors.fieldOptionValue(), { target: { value: '123' } }));

      const elementOption = elementSelectors.fieldOption(false, '123');
      expect(elementOption).toBeInTheDocument();

      const elementOptionSelectors = getFormElementsEditorSelectors(within(elementOption));
      expect(elementOptionSelectors.fieldOptionValue()).toHaveValue('123');
    });

    it('Should update option value for NUMBER option', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0 };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change option number value
       */
      await act(() => fireEvent.change(elementSelectors.fieldOptionNumberValue(), { target: { value: '123' } }));

      const elementOption = elementSelectors.fieldOption(false, '123');
      expect(elementOption).toBeInTheDocument();

      const elementOptionSelectors = getFormElementsEditorSelectors(within(elementOption));
      expect(elementOptionSelectors.fieldOptionNumberValue()).toHaveValue(123);
    });

    it('Should update option label', async () => {
      const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0 };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change option label
       */
      await act(() => fireEvent.change(elementSelectors.fieldOptionLabel(), { target: { value: '123' } }));

      const elementOption = elementSelectors.fieldOption(false, originalOption.value.toString());
      expect(elementOption).toBeInTheDocument();

      const elementOptionSelectors = getFormElementsEditorSelectors(within(elementOption));
      expect(elementOptionSelectors.fieldOptionLabel()).toHaveValue('123');
    });

    it('Should remove option', async () => {
      const originalOption = { label: 'label', type: FormElementType.STRING, value: '111' };
      const element = { ...FormElementDefault, id: 'select', type: FormElementType.SELECT, options: [originalOption] };
      const elements = [element];

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Remove option
       */
      expect(elementSelectors.fieldOption(false, originalOption.value)).toBeInTheDocument();
      await act(() => fireEvent.click(elementSelectors.buttonRemoveOption()));

      expect(elementSelectors.fieldOption(true, originalOption.value)).not.toBeInTheDocument();
    });

    it('Should not update option value if option with the same value exists', async () => {
      const optionOne = { label: 'label', type: FormElementType.STRING, value: '111' };
      const optionTwo = { label: 'label', type: FormElementType.STRING, value: '100' };
      const element = {
        ...FormElementDefault,
        id: 'select',
        type: FormElementType.SELECT,
        options: [optionOne, optionTwo],
      };
      const elements = [element];
      jest.spyOn(window, 'alert').mockImplementationOnce(() => {});

      render(getComponent({ value: elements, onChange }));

      /**
       * Open select element
       */
      const elementSelectors = openElement(element.id, element.type);

      /**
       * Change value which is already exist
       */
      const optionTwoSelectors = getFormElementsEditorSelectors(
        within(elementSelectors.fieldOption(false, optionTwo.value))
      );
      await act(() => fireEvent.change(optionTwoSelectors.fieldOptionValue(), { target: { value: optionOne.value } }));

      /**
       * Check if option is not updated
       */
      expect(elementSelectors.fieldOption(false, optionOne.value)).toBeInTheDocument();
      expect(elementSelectors.fieldOption(false, optionTwo.value)).toBeInTheDocument();
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
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Check section field presence
       */
      expect(elementSelectors.fieldSection()).toBeInTheDocument();
    });

    it('Should update section for element', async () => {
      render(getComponent({ value: elements, onChange, context: { options: { layout: { sections } } } }));

      /**
       * Open id element
       */
      const elementSelectors = openElement('id', FormElementDefault.type);

      /**
       * Change section
       */
      await act(() => fireEvent.change(elementSelectors.fieldSection(), { target: { value: sections[1].name } }));

      expect(elementSelectors.fieldSection()).toHaveValue(sections[1].name);
    });
  });

  /**
   * Auto Save
   */
  describe('Auto Save', () => {
    it('Should call auto save changes if no changes on timeout', async () => {
      const element = { ...FormElementDefault, id: 'string', width: 0 };
      const elements = [element];
      const onChange = jest.fn();

      render(getComponent({ value: elements, onChange }));

      /**
       * Open element
       */
      const elementSelectors = openElement(element.id, element.type);

      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '10' } }));
      await act(() => fireEvent.change(elementSelectors.fieldWidth(), { target: { value: '20' } }));

      await act(() => {
        jest.runAllTimers();
      });

      /**
       * Check call onChange
       */
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            width: 20,
          }),
        ])
      );

      /**
       * Check if save changes button doesn't exist
       */
      await waitFor(() => {
        expect(selectors.buttonSaveChanges(true)).not.toBeInTheDocument();
      });
    });
  });

  it('Should update local elements if prop elements is changed', async () => {
    const element = { ...FormElementDefault, id: 'string' };
    const elements = [element];

    const { rerender } = render(getComponent({ value: elements, onChange }));

    /**
     * Check element presence
     */
    expect(selectors.sectionLabel(false, element.id, element.type)).toBeInTheDocument();

    /**
     * Rerender with new elements
     */
    const updatedElement = { ...FormElementDefault, id: 'select' };
    const updatedElements = [updatedElement];

    await act(() => rerender(getComponent({ value: updatedElements, onChange })));

    /**
     * Check if only updated elements is rendered
     */
    expect(selectors.sectionLabel(true, element.id, element.type)).not.toBeInTheDocument();
    expect(selectors.sectionLabel(false, updatedElement.id, updatedElement.type)).toBeInTheDocument();
  });
});
