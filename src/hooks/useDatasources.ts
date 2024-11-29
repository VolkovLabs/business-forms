import { DataSourceInstanceSettings } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { useEffect, useState } from 'react';

/**
 * Use Datasource
 */
export const useDatasources = () => {
  const [datasources, setDatasources] = useState<DataSourceInstanceSettings[]>([]);

  /**
   * Get Datasources
   */
  useEffect(() => {
    const fetchData = async () => {
      /**
       * Get list of datasources
       */
      const dsList = getDataSourceSrv().getList({
        alerting: false,
        tracing: false,
        metrics: false,
        logs: false,
        dashboard: false,
        mixed: false,
        variables: true,
        annotations: false,
        filter: (dataSource: DataSourceInstanceSettings) => {
          /**
           * Exclude grafana datasource (--Grafana--)
           */
          return dataSource.uid !== 'grafana';
        },
      });
      setDatasources(dsList);
    };

    fetchData();
  }, []);

  return datasources;
};
