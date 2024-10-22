import { DataQueryResponse, InterpolateFunction, LoadingState } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';

import { DatasourceResponseError } from '@/utils';

/**
 * Use Data Source Request
 */
export const useDatasourceRequest = () => {
  return useCallback(
    async ({
      query,
      datasource,
      replaceVariables,
      payload,
    }: {
      query: unknown;
      datasource: string;
      replaceVariables: InterpolateFunction;
      payload: unknown;
    }): Promise<DataQueryResponse> => {
      const ds = await getDataSourceSrv().get(datasource);

      /**
       * Replace Variables
       */
      const targetJson = replaceVariables(JSON.stringify(query, null, 2), {
        payload: {
          value: payload,
        },
      });

      const target = JSON.parse(targetJson);

      try {
        /**
         * Response
         */
        const response = ds.query({
          targets: [target],
        } as never);

        const handleResponse = (response: DataQueryResponse) => {
          if (response.state && response.state === LoadingState.Error) {
            throw response?.errors?.[0] || response;
          }
          return response;
        };

        /**
         * Handle as promise
         */
        if (response instanceof Promise) {
          return await response.then(handleResponse);
        }

        /**
         * Handle as observable
         */
        return await lastValueFrom(response).then(handleResponse);
      } catch (error) {
        throw new DatasourceResponseError(error, targetJson);
      }
    },
    []
  );
};
