import { shallow } from 'enzyme';
import React from 'react';
import { CustomCodeEditor } from './CustomCodeEditor';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ value = [], item = {}, ...restProps }: any) => {
      return <CustomCodeEditor {...restProps} value={value} item={item} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
