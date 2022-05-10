import { shallow } from 'enzyme';
import React from 'react';
import { InputParametersEditor } from './InputParametersEditor';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ value = [], ...restProps }: any) => {
      return <InputParametersEditor {...restProps} value={value} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
