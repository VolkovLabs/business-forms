import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';
import { DataQueryResponse, InterpolateFunction } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';

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
      query: any;
      datasource: string;
      replaceVariables: InterpolateFunction;
    }) => {
      const ds = await getDataSourceSrv().get(datasource);
      const payload = JSON.parse(replaceVariables(JSON.stringify(query)));

      /**
       * Fetch
       */
      return lastValueFrom(
        getBackendSrv().fetch<DataQueryResponse>({
          method: 'POST',
          url: 'api/ds/query',
          data: {
            queries: [
              {
                datasourceId: ds.id,
                refId: 'A',
                ...payload,
              },
            ],
          },
        })
      );
    },
    []
  );
};
