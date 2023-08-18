import { useMemo } from 'react';
import { DataFrame } from '@grafana/data';
import { QueryField } from '../types';

/**
 * Use Query Fields
 */
export const useQueryFields = ({ data, isEnabled }: { data?: DataFrame[]; isEnabled: boolean }) => {
  return useMemo(() => {
    if (isEnabled && data) {
      return data.reduce((acc: QueryField[], { fields, refId }) => {
        return acc.concat(
          fields.map((field) => ({
            value: field.name,
            refId,
            label: `${refId}:${field.name}`,
          }))
        );
      }, []);
    }
    return [];
  }, [data, isEnabled]);
};
