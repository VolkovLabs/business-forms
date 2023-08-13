import { useEffect, useState } from 'react';
import { DataSourceApi } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

/**
 * Use Datasource
 */
export const useDatasources = () => {
  const [datasources, setDatasources] = useState<DataSourceApi[]>([]);

  /**
   * Get Datasources
   */
  useEffect(() => {
    const fetchData = async () => {
      const ds = await getBackendSrv().get('/api/datasources');
      setDatasources(ds);
    };

    fetchData();
  }, []);

  return datasources;
};
