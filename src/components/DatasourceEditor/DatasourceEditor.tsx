import React, { useMemo } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Select } from '@grafana/ui';
import { TestIds } from '../../constants';
import { useDatasources } from '../../hooks';

/**
 * Properties
 */
interface Props extends Pick<StandardEditorProps<string>, 'value' | 'onChange'> {}

/**
 * Data Source Editor
 */
export const DatasourceEditor: React.FC<Props> = ({ value, onChange }) => {
  /**
   * Data Sources
   */
  const datasources = useDatasources();

  /**
   * Options
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
      aria-label={TestIds.datasourceEditor.fieldSelect}
    />
  );
};
