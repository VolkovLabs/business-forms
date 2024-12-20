import { getDataSourceSrv, getTemplateSrv } from '@grafana/runtime';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { DatasourcePayloadEditor } from './DatasourcePayloadEditor';
/**
 * Props
 */
type Props = React.ComponentProps<typeof DatasourcePayloadEditor>;

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: jest.fn(),
  getTemplateSrv: jest.fn(),
}));

/**
 * In Test Ids
 */
const InTestIds = {
  queryEditor: 'data-testid query-editor',
  datasourceUid: 'data-testid datasourceUID-key',
};

describe('DatasourcePayloadEditor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors({
    ...InTestIds,
  });
  const selectors = getSelectors(screen);

  /**
   * Get component
   */
  const getComponent = (props: Partial<Props>) => {
    return <DatasourcePayloadEditor context={{ options: {} }} item={{ settings: {} }} {...(props as any)} />;
  };

  beforeEach(() => {
    jest.mocked(getDataSourceSrv).mockReset();
    jest.mocked(getTemplateSrv).mockReturnValue({
      replace: jest.fn((str) => str),
    } as never);
  });

  it('Should show component and pass correct uid', async () => {
    /**
     * On Change
     */
    const onChange = jest.fn();

    await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: 'datasource',
            },
          } as any,
          onChange,
          value: 'payload',
        })
      )
    );

    expect(selectors.datasourceUid()).toBeInTheDocument();
    expect(selectors.datasourceUid()).toHaveTextContent('postgres');
  });

  it('Should show component and change payload', async () => {
    /**
     * On Change
     */
    const onChange = jest.fn();

    await act(async () =>
      render(
        getComponent({
          context: {
            options: {
              datasource: 'postgres',
            },
          } as any,
          item: {
            settings: {
              datasourceKey: '',
            },
          } as any,
          onChange,
          value: 'payload',
        })
      )
    );

    expect(selectors.queryEditor()).toBeInTheDocument();
    expect(selectors.queryEditor()).toHaveValue('payload');

    fireEvent.change(selectors.queryEditor(), { target: { value: 'updated payload' } });
    expect(onChange).toHaveBeenCalledWith('updated payload');
  });
});
