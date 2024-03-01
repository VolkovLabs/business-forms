import { DataSourceApi, QueryEditorProps, StandardEditorProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { get } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAutoSave } from '../../hooks';
import { PanelOptions } from '../../types';

/**
 * Properties
 */
type Props = StandardEditorProps<unknown, { datasourceKey: string }, PanelOptions>;

/**
 * On Run query
 */
const onRunQuery = () => null;

/**
 * Payload Editor
 */
export const PayloadEditor: React.FC<Props> = ({ context, value, onChange, item }) => {
  const dataSourceService = getDataSourceSrv();
  const [datasource, setDatasource] = useState<DataSourceApi>();
  const queryEditor = useRef<React.ComponentType<QueryEditorProps<DataSourceApi<any, any>, any, any>>>();
  const { startTimer, removeTimer } = useAutoSave();
  const [query, setQuery] = useState(value);
  const [isChanged, setIsChanged] = useState(false);

  /**
   * On Change Query
   */
  const onChangeQuery = useCallback((query: unknown) => {
    setQuery(query);
    setIsChanged(true);
  }, []);

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(query);
    setIsChanged(false);
  }, [onChange, query]);

  /**
   * Load Query Editor
   */
  useEffect(() => {
    const datasourceName = get(context.options, item.settings?.datasourceKey || '');

    const getDataSource = async () => {
      const ds = await dataSourceService.get(datasourceName);

      if (ds && ds.components?.QueryEditor) {
        setDatasource(ds);
        queryEditor.current = ds.components.QueryEditor;
      }
    };

    /**
     * Reset query if new datasource
     */
    if (datasource && datasource.name !== datasourceName) {
      onChangeQuery({});
    }

    /**
     * Load data source
     */
    if (datasource?.id !== datasourceName) {
      getDataSource();
    }
  }, [context.options, dataSourceService, datasource, item.settings?.datasourceKey, onChangeQuery]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }

    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer]);

  /**
   * No editor or data source
   */
  if (!queryEditor.current || !datasource) {
    return 'No query editor';
  }

  /**
   * Query Editor
   */
  const Editor = queryEditor.current;

  return <Editor datasource={datasource} query={query} onChange={onChangeQuery} onRunQuery={onRunQuery} />;
};
