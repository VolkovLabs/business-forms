import { Observable } from 'rxjs';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { renderHook } from '@testing-library/react';
import { useDatasourceRequest } from './useDatasourceRequest';

/**
 * Response
 *
 * @param response
 */
export const getResponse = (response: any) =>
  new Observable((subscriber) => {
    subscriber.next(response);
    subscriber.complete();
  });

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(),
  getDataSourceSrv: jest.fn(),
}));

describe('Use Datasource Request', () => {
  it('Should run query', async () => {
    const getDataSourceSrvMock = jest.fn(() => ({
      id: '123',
    }));
    jest.mocked(getDataSourceSrv).mockImplementationOnce(
      () =>
        ({
          get: getDataSourceSrvMock,
        }) as any
    );
    const fetchMock = jest.fn(() =>
      getResponse({
        data: {
          message: 'hello',
        },
      })
    );
    jest.mocked(getBackendSrv).mockImplementationOnce(
      () =>
        ({
          fetch: fetchMock,
        }) as any
    );
    const { result } = renderHook(() => useDatasourceRequest());

    const response = await result.current({
      query: {
        key1: 'value1',
        key2: 'value2',
      },
      datasource: 'abc',
      replaceVariables: jest.fn((str) => str),
    });

    /**
     * Should get datasource
     */
    expect(getDataSourceSrvMock).toHaveBeenCalledWith('abc');

    /**
     * Should pass query
     */
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          queries: [
            {
              datasourceId: '123',
              refId: 'A',
              key1: 'value1',
              key2: 'value2',
            },
          ],
        },
      })
    );

    /**
     * Should return result
     */
    expect(response).toEqual({
      data: {
        message: 'hello',
      },
    });
  });
});
