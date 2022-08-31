import { shallow } from 'enzyme';
import React from 'react';
import { LayoutSectionsEditor } from './LayoutSectionsEditor';

/**
 * Panel
 */
describe('Panel', () => {
  const onChange = jest.fn();

  /**
   * Sections
   */
  it('Should find component with sections', async () => {
    const sections = [{ name: 'Section' }, { name: 'Section 2' }];

    const getComponent = ({ value = [], ...restProps }: any) => {
      return <LayoutSectionsEditor {...restProps} value={value} />;
    };

    const wrapper = shallow(getComponent({ value: sections, onChange }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();

    const addButton = div.find('[icon="plus"]');
    expect(addButton.exists()).toBeTruthy();
    addButton.simulate('click');

    const name = div.find('Input[placeholder="name"]').first();
    expect(name.exists()).toBeTruthy();
    name.simulate('change', { target: { value: 'name' } });

    const firstRemoveButton = div.find('[icon="minus"]').first();
    expect(firstRemoveButton.exists()).toBeTruthy();
    firstRemoveButton.simulate('click');

    const lastRemoveButton = div.find('[icon="minus"]').last();
    expect(lastRemoveButton.exists()).toBeTruthy();
    lastRemoveButton.simulate('click');
  });

  /**
   * No sections
   */
  it('Should find component without sections', async () => {
    const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
      return <LayoutSectionsEditor {...restProps} value={value} />;
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
