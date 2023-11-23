import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { TEST_IDS } from '../../constants';
import { useDatasources } from '../../hooks';
import { DatasourceEditor } from './DatasourceEditor';

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
  const getSelectors = getJestSelectors(TEST_IDS.datasourceEditor);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = null, context = {}, ...restProps }: any) => {
    return <DatasourceEditor onChange={onChange} {...restProps} value={value} context={context} />;
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
