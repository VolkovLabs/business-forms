import { DataFrame, getFieldDisplayName } from '@grafana/data';
import { useMemo } from 'react';

import { QueryField } from '../types';

/**
 * Use Query Fields
 */
export const useQueryFields = ({ data, isEnabled }: { data?: DataFrame[]; isEnabled: boolean }) => {
  return useMemo(() => {
    if (isEnabled && data) {
      return data.reduce((acc: QueryField[], frame) => {
        const { fields, refId } = frame;
        return acc.concat(
          fields.map((field) => {
            const fieldName = getFieldDisplayName(field, frame, data);
            return {
              value: field.name,
              refId,
              label: `${refId}:${fieldName}`,
            };
          })
        );
      }, []);
    }
    return [];
  }, [data, isEnabled]);
};
