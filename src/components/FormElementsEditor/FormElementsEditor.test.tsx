import { shallow } from 'enzyme';
import React from 'react';
import { FormElementsEditor } from './FormElementsEditor';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ value = [], context = { options: {} }, ...restProps }: any) => {
      return <FormElementsEditor {...restProps} value={value} context={context} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
