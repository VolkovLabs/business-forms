import { shallow } from 'enzyme';
import React from 'react';
import { CodeLanguage, FormElementDefault, FormElementType } from '../../constants';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Panel
 */
describe('Panel', () => {
  const onChange = jest.fn();

  /**
   * New Element
   */
  it('Should find component with new Element', async () => {
    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: [], onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const newElement = wrapper.find('CollapsableSection[label="New Element"]');
    expect(newElement.exists()).toBeTruthy();

    const id = newElement.find('Input[placeholder="Id"]');
    expect(id.exists()).toBeTruthy();
    id.simulate('change', { target: { value: 'text' } });

    const title = newElement.find('Input[placeholder="Label"]');
    expect(title.exists()).toBeTruthy();
    title.simulate('change', { target: { value: FormElementType.NUMBER } });

    const select = newElement.find('[options]');
    expect(select.exists()).toBeTruthy();
    select.simulate('change', { value: FormElementType.SLIDER });

    const button = newElement.find('Button');
    expect(button.exists()).toBeTruthy();
    button.simulate('click');
  });

  /**
   * Id Element
   */
  it('Should find component with Id Element', async () => {
    const elements = [{ ...FormElementDefault, id: 'id' }];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const id = element.find('Input[placeholder="Id"]');
    expect(id.exists()).toBeTruthy();
    id.simulate('change', { target: { value: 'text' } });

    const type = element.find('[options]');
    expect(type.exists()).toBeTruthy();
    type.simulate('change', { value: FormElementType.CODE });
    type.simulate('change', { value: FormElementType.SLIDER });

    const width = element.find('Input[placeholder="auto"]');
    expect(width.exists()).toBeTruthy();
    width.simulate('change', { target: { value: 10 } });

    const label = element.find('Input[placeholder="Label"]');
    expect(label.exists()).toBeTruthy();
    label.simulate('change', { target: { value: 'label' } });

    const labelWidth = element.find('Input[placeholder="10"]');
    expect(labelWidth.exists()).toBeTruthy();
    labelWidth.simulate('change', { target: { value: 8 } });

    const tooltip = element.find('Input[placeholder="Tooltip"]');
    expect(tooltip.exists()).toBeTruthy();
    tooltip.simulate('change', { target: { value: 'Tooltip' } });

    const unit = element.find('Input[placeholder="Unit"]');
    expect(unit.exists()).toBeTruthy();
    unit.simulate('change', { target: { value: 'HZ' } });

    const removeButton = element.find('[icon="trash-alt"]');
    expect(removeButton.exists()).toBeTruthy();
    removeButton.simulate('click');
  });

  /**
   * No Elements
   */
  it('Should find component without elements', async () => {
    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: null, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });

  /**
   * Slider
   */
  it('Should find component with Slider', async () => {
    const elements = [{ ...FormElementDefault, id: 'slider', type: FormElementType.SLIDER }];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const min = element.find('Input[placeholder="Min"]');
    expect(min.exists()).toBeTruthy();
    min.simulate('change', { target: { value: 1 } });

    const max = element.find('Input[placeholder="Max"]');
    expect(max.exists()).toBeTruthy();
    max.simulate('change', { target: { value: 10 } });

    const step = element.find('Input[placeholder="Step"]');
    expect(step.exists()).toBeTruthy();
    step.simulate('change', { target: { value: 2 } });
  });

  /**
   * Number
   */
  it('Should find component with Number', async () => {
    const elements = [{ ...FormElementDefault, id: 'number', type: FormElementType.NUMBER }];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const min = element.find('Input[placeholder="Min"]');
    expect(min.exists()).toBeTruthy();
    min.simulate('change', { target: { value: 1 } });

    const max = element.find('Input[placeholder="Max"]');
    expect(max.exists()).toBeTruthy();
    max.simulate('change', { target: { value: 10 } });
  });

  /**
   * TextArea
   */
  it('Should find component with TextArea', async () => {
    const elements = [{ ...FormElementDefault, id: 'textarea', type: FormElementType.TEXTAREA }];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const rows = element.find('Input[placeholder="Rows"]');
    expect(rows.exists()).toBeTruthy();
    rows.simulate('change', { target: { value: 10 } });
  });

  /**
   * Code Editor
   */
  it('Should find component with Code Editor', async () => {
    const elements = [{ ...FormElementDefault, id: 'code', type: FormElementType.CODE }];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const height = element.find('Input[placeholder="Height"]');
    expect(height.exists()).toBeTruthy();
    height.simulate('change', { target: { value: 10 } });

    const select = element.find('[defaultValue="javascript"]');
    expect(select.exists()).toBeTruthy();
    select.simulate('change', { value: CodeLanguage.JSON });
  });

  /**
   * Select
   */
  it('Should find component with Select', async () => {
    const elements = [
      {
        ...FormElementDefault,
        id: 'select',
        type: FormElementType.SELECT,
        options: [{ id: 'id', label: 'label', type: FormElementType.NUMBER }],
      },
    ];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element = wrapper.find('CollapsableSection').first();
    expect(element.exists()).toBeTruthy();

    const addButton = element.find('[icon="plus"]');
    expect(addButton.exists()).toBeTruthy();
    addButton.simulate('click');

    const id = element.find('Input[placeholder="number"]');
    expect(id.exists()).toBeTruthy();
    id.simulate('change', { target: { value: 10 } });

    const label = element.find('Input[placeholder="label"]');
    expect(label.exists()).toBeTruthy();
    label.simulate('change', { target: { value: 'Id' } });

    const select = element.find(`Select[defaultValue="string"]`);
    expect(select.exists()).toBeTruthy();
    select.simulate('change', { value: FormElementType.STRING });

    const removeButton = element.find('[icon="minus"]');
    expect(removeButton.exists()).toBeTruthy();
    removeButton.simulate('click');
  });

  /**
   * Two elements
   */
  it('Should find component with Two Elements', async () => {
    const elements = [
      { ...FormElementDefault, id: 'number' },
      { id: 'text', textarea: FormElementType.TEXTAREA },
    ];

    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: elements, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const element1 = wrapper.find('CollapsableSection').first();
    expect(element1.exists()).toBeTruthy();

    const element2 = wrapper.find('CollapsableSection').last();
    expect(element2.exists()).toBeTruthy();
  });
});
