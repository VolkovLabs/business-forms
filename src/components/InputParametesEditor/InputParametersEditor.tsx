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
  const defaultParameter = { id: '', title: '', type: InputParameterType.STRING };

  /**
   * States
   */
  const [newParameter, setNewParameter] = useState(defaultParameter);
  const [parameters, setParameters] = useState(value || []);

  /**
   * Remove Parameter
   */
  const onParameterRemove = (id: string) => {
    const updated = parameters.filter((e) => e.id !== id);

    /**
     * Update Parameters
     */
    setParameters(updated);
    onChange(updated);
  };

  /**
   * Add Parameter
   */
  const onParameterAdd = () => {
    const updated = [...parameters, newParameter];

    /**
     * Update Parameters
     */
    setParameters(updated);
    onChange(updated);

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
      {parameters.map((parameter) => (
        <FieldSet key={parameter.id}>
          <InlineFieldRow>
            <InlineField label="Id" grow labelWidth={8} invalid={parameter.id === ''}>
              <Input
                placeholder="Id"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  parameter.id = event.target.value;
                  setParameters(parameters);
                  onChange(parameters);
                }}
                value={parameter.id}
              />
            </InlineField>
            <Button variant="destructive" onClick={(e) => onParameterRemove(parameter.id)} icon="trash-alt">
              Remove
            </Button>
          </InlineFieldRow>

          <InlineField label="Title" grow labelWidth={8} invalid={parameter.title === ''}>
            <Input
              placeholder="Title"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                parameter.title = event.target.value;
                setParameters(parameters);
                onChange(parameters);
              }}
              value={parameter.title}
            />
          </InlineField>

          <InlineField label="Type" grow labelWidth={8}>
            <Select
              options={InputParameterTypeOptions}
              onChange={(event?: SelectableValue) => {
                parameter.type = event?.value;
                setParameters(parameters);
                onChange(parameters);
              }}
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

        <InlineField label="Title" grow labelWidth={8} invalid={newParameter.title === ''}>
          <Input
            placeholder="Title"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewParameter({ ...newParameter, title: event.target.value });
            }}
            value={newParameter.title}
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
