import { shallow } from 'enzyme';
import React from 'react';
import { FormElementDefault } from '../../constants';
import { FormElements } from './FormElements';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({
      options = {
        submit: {},
        initial: {},
        update: {},
        reset: {},
        elements: [FormElementDefault],
      },
      ...restProps
    }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
