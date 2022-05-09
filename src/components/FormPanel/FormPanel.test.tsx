import { shallow } from 'enzyme';
import React from 'react';
import { FormPanel } from './FormPanel';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormPanel {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
