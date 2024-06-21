import { DataFrame, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Select } from '@grafana/ui';
import React, { useMemo } from 'react';

import { TEST_IDS } from '../../constants';
import { QueryOptionsMapper } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Value
   *
   * @type {QueryOptionsMapper}
   */
  value?: QueryOptionsMapper;

  /**
   * On Change
   */
  onChange: (value: QueryOptionsMapper | undefined) => void;

  /**
   * Data
   */
  data: DataFrame[];
}

/**
 * Element Query Options Editor
 */
export const ElementQueryOptionsEditor: React.FC<Props> = ({ value, onChange, data }) => {
  /**
   * Available Field Options
   */
  const availableFieldOptions = useMemo(() => {
    const source = value?.source;

    const valueOptions = data.reduce((acc: SelectableValue[], dataFrame) => {
      return acc.concat(
        dataFrame.fields.map((field) => ({
          value: `${dataFrame.refId}:${field.name}`,
          fieldName: field.name,
          label: `${dataFrame.refId}:${field.name}`,
          source: dataFrame.refId,
        }))
      );
    }, []);

    if (source) {
      const dataFrame = data.find((dataFrame) => dataFrame.refId === source);

      const labelOptions = dataFrame?.fields.map(({ name }) => ({
        label: `${dataFrame.refId}:${name}`,
        source: dataFrame.refId,
        value: name,
        fieldName: name,
      }));

      return {
        valueOptions,
        labelOptions,
      };
    }

    return {
      valueOptions,
      labelOptions: [],
    };
  }, [data, value?.source]);

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Value Field" grow={true}>
          <Select
            options={availableFieldOptions.valueOptions}
            value={`${value?.source}:${value?.value}`}
            onChange={(option) =>
              onChange(
                !option
                  ? undefined
                  : {
                      ...value,
                      source: option.source,
                      value: option.fieldName,
                      label: value?.source !== option.source ? null : value?.label || null,
                    }
              )
            }
            aria-label={TEST_IDS.formElementsEditor.fieldQueryOptionsValue}
            isClearable
          />
        </InlineField>
      </InlineFieldRow>
      {value?.value && (
        <InlineFieldRow>
          <InlineField label="Label Field" grow={true}>
            <Select
              options={availableFieldOptions.labelOptions}
              value={value.label}
              onChange={(option) =>
                onChange({
                  ...value,
                  label: option ? option.fieldName : '',
                })
              }
              aria-label={TEST_IDS.formElementsEditor.fieldQueryOptionsLabel}
              isClearable
            />
          </InlineField>
        </InlineFieldRow>
      )}
    </>
  );
};
