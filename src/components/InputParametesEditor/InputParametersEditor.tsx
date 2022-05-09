import React, { ChangeEvent, useState } from 'react';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Button, FieldSet, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { InputParameterType, InputParameterTypeOptions } from '../../constants';
import { InputParameter } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<InputParameter[]> {}

/**
 * Input Parameters Editor
 */
export const InputParametersEditor: React.FC<Props> = ({ value, onChange }) => {
  const defaultParameter = { id: '', type: InputParameterType.STRING };
  const [newParameter, setNewParameter] = useState(defaultParameter);
  const [valueState, setValueState] = useState(value || []);

  /**
   * On Parameter Remove
   */
  const onParameterRemove = (id: string) => {
    const values = valueState.filter((e) => e.id !== id);

    /**
     * Update Parameters
     */
    setValueState(values);
    onChange(values);
  };

  /**
   * On Parameter Add
   */
  const onParameterAdd = () => {
    const values = [...valueState, newParameter];

    /**
     * Update Parameters
     */
    setValueState(values);
    onChange(values);

    /**
     * Reset input values
     */
    setNewParameter(defaultParameter);
  };

  /**
   * Return
   */
  return (
    <div>
      {valueState.map((parameter) => (
        <FieldSet key={parameter.id}>
          <InlineFieldRow>
            <InlineField label="Id" grow labelWidth={8} invalid={parameter.id === ''}>
              <Input placeholder="Id" onChange={(event: ChangeEvent<HTMLInputElement>) => {}} value={parameter.id} />
            </InlineField>
            <Button variant="destructive" onClick={(e) => onParameterRemove(parameter.id)} icon="trash-alt">
              Remove
            </Button>
          </InlineFieldRow>

          <InlineField label="Type" grow labelWidth={8}>
            <Select
              options={InputParameterTypeOptions}
              onChange={(event?: SelectableValue) => {}}
              value={InputParameterTypeOptions.find((type) => type.value === parameter.type)}
            />
          </InlineField>

          <hr />
        </FieldSet>
      ))}

      <FieldSet>
        <InlineField label="Id" grow labelWidth={8} invalid={newParameter.id === ''}>
          <Input
            placeholder="Id"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewParameter({ ...newParameter, id: event.target.value });
            }}
            value={newParameter.id}
          />
        </InlineField>

        <InlineField label="Type" grow labelWidth={8}>
          <Select
            options={InputParameterTypeOptions}
            onChange={(event?: SelectableValue) => {
              setNewParameter({ ...newParameter, type: event?.value });
            }}
            value={InputParameterTypeOptions.find((type) => type.value === newParameter.type)}
          />
        </InlineField>

        <Button
          variant="secondary"
          onClick={(e) => onParameterAdd()}
          disabled={!!!newParameter.id || !!!newParameter.type}
          icon="plus"
        >
          Add Parameter
        </Button>
      </FieldSet>
    </div>
  );
};
