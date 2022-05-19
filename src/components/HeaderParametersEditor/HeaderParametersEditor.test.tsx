import { shallow } from 'enzyme';
import React from 'react';
import { HeaderParametersEditor } from './HeaderParametersEditor';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ value = [], ...restProps }: any) => {
      return <HeaderParametersEditor {...restProps} value={value} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
