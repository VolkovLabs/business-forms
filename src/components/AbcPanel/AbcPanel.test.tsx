import { shallow } from 'enzyme';
import React from 'react';
import { toDataFrame } from '@grafana/data';
import { AbcPanel } from './AbcPanel';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ options = { name: 'data' }, ...restProps }: any) => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            fields: [],
          }),
        ],
      };
      return <AbcPanel data={data} {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });

  it('Should get the latest value', async () => {
    const getComponent = ({ options = { name: 'data' }, ...restProps }: any) => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            refId: 'A',
            fields: [
              {
                name: 'data',
                type: 'string',
                values: ['Hello World!'],
              },
            ],
          }),
        ],
      };
      return <AbcPanel data={data} {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
    expect(div.text()).toEqual('Hello World!');
  });
});
