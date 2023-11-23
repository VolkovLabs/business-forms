import { Field } from '@grafana/data';

/**
 * Get Field Values
 * @param field
 */
export const getFieldValues = (field?: Field): unknown[] => {
  if (!field) {
    return [];
  }

  // eslint-disable-next-line deprecation/deprecation
  return field.values.toArray ? field.values.toArray() : field.values;
};
