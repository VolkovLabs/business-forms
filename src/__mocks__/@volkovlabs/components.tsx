import { Input } from '@grafana/ui';
import React, { ChangeEvent, useCallback } from 'react';

const actual = jest.requireActual('@volkovlabs/components');

/**
 * Properties
 */
interface Props extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  /**
   * on Change
   * @param value
   */
  onChange?: (value: number) => void;

  /**
   * Value
   *
   * @type {number}
   */
  value: number | string;

  /**
   * Step
   *
   * @type {number}
   */
  step?: number;

  /**
   * Min
   *
   * @type {min}
   */
  min?: number;

  /**
   * Max
   *
   * @type {max}
   */
  max?: number;
}

/**
 * Number Input
 */
const NumberInputMock: React.FC<Props> = ({ value, onChange, min, max, step, ...restProps }) => {
  /**
   * Number Value
   */
  const numberValue = Number(value);

  /**
   * On Save Value
   */
  const onSaveValue = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      let v = Number(event.target.value);

      if (Number.isNaN(v)) {
        v = 0;
      }

      if (step !== undefined && (v * 1000) % (step * 1000) !== 0) {
        v = 0;
      }

      if (max !== undefined && v > max) {
        v = max;
      } else if (min !== undefined && v < min) {
        v = min;
      }

      onChange?.(v);
    },
    [max, min, onChange, step]
  );

  return <Input {...restProps} type="number" value={numberValue} onChange={onSaveValue} />;
};

const NumberInput = jest.fn(NumberInputMock);

const useDatasourceRequest = jest.fn();

/**
 * Mock DatasourcePayloadEditor
 */
const DatasourcePayloadEditorMock = ({ onChange, ...restProps }: any) => {
  return (
    <>
      <input
        data-testid="data-testid query-editor"
        value={restProps.value}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value);
          }
        }}
      />
      <span data-testid="data-testid datasourceUID-key">{restProps.datasourceUid}</span>
    </>
  );
};

const DatasourcePayloadEditor = jest.fn(DatasourcePayloadEditorMock);

/**
 * Set mocks
 */
beforeEach(() => {
  DatasourcePayloadEditor.mockImplementation(DatasourcePayloadEditorMock);
  NumberInput.mockImplementation(NumberInputMock);
});

module.exports = {
  ...actual,
  NumberInput,
  DatasourcePayloadEditor,
  useDatasourceRequest,
};
