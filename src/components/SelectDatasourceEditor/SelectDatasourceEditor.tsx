import React, { useMemo } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import { useDatasources } from '../../hooks';

/**
 * Properties
 */
interface Props extends StandardEditorProps<string> {}

/**
 * Select Datasource Editor
 */
export const SelectDatasourceEditor: React.FC<Props> = ({ value, onChange }) => {
  /**
   * Datasources
   */
  const datasources = useDatasources();

  /**
   * Datasource Options
   */
  const datasourceOptions = useMemo(() => {
    return datasources.map((datasource) => ({
      label: datasource.name,
      value: datasource.name,
    }));
  }, [datasources]);
  /**
   * Return
   */
  return (
    <Select
      onChange={(item) => {
        onChange(item.value);
      }}
      options={datasourceOptions}
      value={value}
    />
  );
};
