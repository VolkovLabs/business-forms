import { useMemo } from 'react';
import { DataFrame } from '@grafana/data';

/**
 * Use Query Fields
 */
export const useQueryFields = ({ data, isEnabled }: { data?: DataFrame[]; isEnabled: boolean }) => {
  return useMemo(() => {
    if (isEnabled && data) {
      return data[0]?.fields.map((field) => field.name) || [];
    }
    return [];
  }, [data, isEnabled]);
};
