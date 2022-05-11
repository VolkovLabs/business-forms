import { shallow } from 'enzyme';
import React from 'react';
import { ButtonOrientation, InputParameterDefault } from '../../constants';
import { FormPanel } from './FormPanel';

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
        reset: {},
        buttonGroup: { orientation: ButtonOrientation.CENTER },
        parameters: [InputParameterDefault],
      },
      ...restProps
    }: any) => {
      return <FormPanel {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const fieldSet = wrapper.find('FieldSet');
    expect(fieldSet.exists()).toBeTruthy();
  });

  it('Should find component with Alert message', async () => {
    const getComponent = ({
      options = {
        submit: {},
        initial: {},
        update: {},
        reset: {},
        buttonGroup: { orientation: ButtonOrientation.CENTER },
      },
      ...restProps
    }: any) => {
      return <FormPanel {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const alert = wrapper.find('Alert');
    expect(alert.exists()).toBeTruthy();
  });
});
