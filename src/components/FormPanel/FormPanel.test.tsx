import { shallow } from 'enzyme';
import React from 'react';
import { InputParameterType } from '../../constants';
import { FormPanel } from './FormPanel';

/**
 * Initial Parameters
 */
const parameters = [{ id: 'name', title: 'Name', type: InputParameterType.STRING }];

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component with Parameters', async () => {
    const getComponent = ({
      options = {
        submit: {},
        initial: {},
        update: {},
        parameters,
      },
      ...restProps
    }: any) => {
      return <FormPanel {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });

  it('Should find component with Alert message', async () => {
    const getComponent = ({ options = { submit: {}, initial: {}, update: {} }, ...restProps }: any) => {
      return <FormPanel {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const alert = wrapper.find('Alert');
    expect(alert.exists()).toBeTruthy();
  });
});
