import { getBackendSrv } from '@grafana/runtime';
import { renderHook, waitFor } from '@testing-library/react';

import { useDatasources } from './useDatasources';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(),
}));

describe('Use Datasources', () => {
  it('Should return datasources', async () => {
    const getDatasourcesMock = jest.fn(() => [
      {
        name: 'abc',
      },
      {
        name: 'cba',
      },
    ]);
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          get: getDatasourcesMock,
        }) as any
    );

    const { result } = renderHook(() => useDatasources());

    await waitFor(() => expect(result.current).toHaveLength(2));

    const datasources = result.current;

    /**
     * Should get datasources
     */
    expect(getDatasourcesMock).toHaveBeenCalledWith('/api/datasources');

    expect(datasources).toEqual([
      {
        name: 'abc',
      },
      {
        name: 'cba',
      },
    ]);
  });
});
