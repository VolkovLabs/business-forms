import { useCallback } from 'react';
import { lastValueFrom } from 'rxjs';
import { InterpolateFunction } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';

/**
 * Use Datasource Request
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

      try {
        const result = await lastValueFrom(
          getBackendSrv().fetch({
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

        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    []
  );
};
