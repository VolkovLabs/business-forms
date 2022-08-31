import { shallow } from 'enzyme';
import React from 'react';
import { HeaderParametersEditor } from './HeaderParametersEditor';

/**
 * Panel
 */
describe('Panel', () => {
  const onChange = jest.fn();

  /**
   * Parameters
   */
  it('Should find component with parameters', async () => {
    const parameters = [{ name: 'Authorization', value: 'Token' }];
    const getComponent = ({ value = [], ...restProps }: any) => {
      return <HeaderParametersEditor {...restProps} value={value} />;
    };

    const wrapper = shallow(getComponent({ value: parameters, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const addButton = div.find('[icon="plus"]');
    expect(addButton.exists()).toBeTruthy();
    addButton.simulate('click');

    const name = div.find('Input[placeholder="name"]');
    expect(name.exists()).toBeTruthy();
    name.simulate('change', { target: { value: 'name' } });

    const value = div.find('Input[placeholder="value"]');
    expect(value.exists()).toBeTruthy();
    value.simulate('change', { target: { value: 'value' } });

    const removeButton = div.find('[icon="minus"]');
    expect(removeButton.exists()).toBeTruthy();
    removeButton.simulate('click');
  });

  /**
   * No parameters
   */
  it('Should find component without parameters', async () => {
    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <HeaderParametersEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({ value: null, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const input = div.find('Input');
    expect(input.exists()).toBeFalsy();

    const addButton = div.find('[icon="plus"]');
    expect(addButton.exists()).toBeTruthy();
    addButton.simulate('click');
  });
});
