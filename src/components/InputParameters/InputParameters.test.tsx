import { shallow } from 'enzyme';
import React from 'react';
import { InputParameterDefault } from '../../constants';
import { InputParameters } from './InputParameters';

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
        parameters: [InputParameterDefault],
      },
      ...restProps
    }: any) => {
      return <InputParameters options={options} {...restProps} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
