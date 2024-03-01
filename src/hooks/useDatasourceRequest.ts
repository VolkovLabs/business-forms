import { DataQueryResponse, InterpolateFunction } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';

/**
 * Use Data Source Request
 */
export const useDatasourceRequest = () => {
  return useCallback(
    async ({
      query,
      datasource,
      replaceVariables,
    }: {
      query: unknown;
      datasource: string;
      replaceVariables: InterpolateFunction;
    }): Promise<DataQueryResponse> => {
      const ds = await getDataSourceSrv().get(datasource);
      const payload = JSON.parse(replaceVariables(JSON.stringify(query)));
      const response = ds.query(payload);

      if (response instanceof Promise) {
        return await response;
      }

      return await lastValueFrom(response);
    },
    []
  );
};
