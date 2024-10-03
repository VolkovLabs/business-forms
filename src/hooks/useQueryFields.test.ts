import { renderHook } from '@testing-library/react';

import { useQueryFields } from './useQueryFields';

const createDataFrame = ({ fields, frameName, refId }: { fields: any; frameName: string; refId?: any }) => ({
  refId: refId,
  fields: fields.map((name: string) => ({ name })),
  name: frameName,
});

describe('useQueryFields', () => {
  it('Should return an array', () => {
    const data: any = [
      createDataFrame({ refId: 'A', fields: ['field1', 'field2'], frameName: 'Frame A' }),
      createDataFrame({ refId: 'B', fields: ['field3'], frameName: 'Frame B' }),
    ];
    const { result } = renderHook(() => useQueryFields({ data, isEnabled: true }));

    expect(result.current).toEqual([
      { value: 'Frame A field1', refId: 'A', label: 'A:Frame A field1' },
      { value: 'Frame A field2', refId: 'A', label: 'A:Frame A field2' },
      { value: 'Frame B field3', refId: 'B', label: 'B:Frame B field3' },
    ]);
  });

  it('Should return an array if refId the same value', () => {
    const data: any = [
      createDataFrame({ refId: 'A', fields: ['field1', 'field2'], frameName: 'Frame A' }),
      createDataFrame({ refId: 'A', fields: ['field1', 'field2'], frameName: 'Frame A-1' }),
    ];
    const { result } = renderHook(() => useQueryFields({ data, isEnabled: true }));

    expect(result.current).toEqual([
      { value: 'Frame A field1', refId: 'A', label: 'A:Frame A field1' },
      { value: 'Frame A field2', refId: 'A', label: 'A:Frame A field2' },
      { value: 'Frame A-1 field1', refId: 'A', label: 'A:Frame A-1 field1' },
      { value: 'Frame A-1 field2', refId: 'A', label: 'A:Frame A-1 field2' },
    ]);
  });

  it('Should return an array if refId is not provided', () => {
    const data: any = [
      createDataFrame({ fields: ['field1', 'field2'], frameName: 'Frame A' }),
      createDataFrame({ fields: ['field1', 'field2'], frameName: 'Frame A-1' }),
    ];
    const { result } = renderHook(() => useQueryFields({ data, isEnabled: true }));

    expect(result.current).toEqual([
      { value: 'Frame A field1', refId: undefined, label: 'undefined:Frame A field1' },
      { value: 'Frame A field2', refId: undefined, label: 'undefined:Frame A field2' },
      { value: 'Frame A-1 field1', refId: undefined, label: 'undefined:Frame A-1 field1' },
      { value: 'Frame A-1 field2', refId: undefined, label: 'undefined:Frame A-1 field2' },
    ]);
  });
});
