import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import { TestIds } from '../../constants';
import { useDatasources } from '../../hooks';
import { SelectDatasourceEditor } from './SelectDatasourceEditor';

/**
 * Mock hooks
 */
jest.mock('../../hooks', () => ({
  useDatasources: jest.fn(() => []),
}));

describe('Select Datasource Editor', () => {
  const onChange = jest.fn();

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TestIds.selectDatasourceEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = null, context = {}, ...restProps }: any) => {
    return <SelectDatasourceEditor onChange={onChange} {...restProps} value={value} context={context} />;
  };

  it('Should update value', () => {
    jest.mocked(useDatasources).mockImplementationOnce(
      () =>
        [
          {
            name: '123',
          },
          {
            name: 'abc',
          },
        ] as any
    );
    render(getComponent({}));

    fireEvent.change(selectors.fieldSelect(), { target: { value: 'abc' } });

    expect(onChange).toHaveBeenCalledWith('abc');
  });
});
