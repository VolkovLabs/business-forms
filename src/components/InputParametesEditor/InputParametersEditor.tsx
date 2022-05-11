import React, { ChangeEvent, useState } from 'react';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Button, FieldSet, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import {
  InputParameterDefault,
  InputParameterOptionDefault,
  InputParameterType,
  InputParameterTypeOptions,
  SliderDefault,
} from '../../constants';
import { InputParameter } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<InputParameter[]> {}

/**
 * Input Parameters Editor
 */
export const InputParametersEditor: React.FC<Props> = ({ value: parameters, onChange }) => {
  /**
   * States
   */
  const [newParameter, setNewParameter] = useState(InputParameterDefault);

  if (!parameters || !parameters.length) {
    parameters = [];
  }

  /**
   * Remove Parameter
   */
  const onParameterRemove = (id: string) => {
    const updated = parameters.filter((e) => e.id !== id);

    /**
     * Update Parameters
     */
    onChange(updated);
  };

  /**
   * Add Parameter
   */
  const onParameterAdd = () => {
    /**
     * Slider values
     */
    if (newParameter.type === InputParameterType.SLIDER) {
      newParameter.min = SliderDefault.min;
      newParameter.max = SliderDefault.max;
      newParameter.step = SliderDefault.step;
      newParameter.value = SliderDefault.value;
    }

    /**
     * Update Parameters
     */
    const updated = [...parameters, newParameter];
    onChange(updated);

    /**
     * Reset input values
     */
    setNewParameter(InputParameterDefault);
  };

  /**
   * Return
   */
  return (
    <div>
      {parameters.map((parameter) => (
        <FieldSet key={parameter.id} label={`Parameter: ${parameter.id}`}>
          <InlineFieldRow>
            <InlineField label="Id" grow labelWidth={8} invalid={parameter.id === ''}>
              <Input
                placeholder="Id"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  parameter.id = event.target.value;
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
                onChange(parameters);
              }}
              value={parameter.title}
            />
          </InlineField>

          <InlineField label="Type" grow labelWidth={8}>
            <Select
              options={InputParameterTypeOptions}
              onChange={(event: SelectableValue) => {
                parameter.type = event?.value;
                onChange(parameters);
              }}
              value={InputParameterTypeOptions.find((type) => type.value === parameter.type)}
            />
          </InlineField>

          {parameter.type === InputParameterType.SLIDER && (
            <InlineFieldRow>
              <InlineField label="Min" labelWidth={8}>
                <Input
                  placeholder="Min"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.min = Number(event.target.value);
                    onChange(parameters);
                  }}
                  type="number"
                  width={10}
                  value={parameter.min}
                />
              </InlineField>
              <InlineField label="Max" labelWidth={8}>
                <Input
                  placeholder="Max"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.max = Number(event.target.value);
                    onChange(parameters);
                  }}
                  type="number"
                  width={10}
                  value={parameter.max}
                />
              </InlineField>
              <InlineField label="Step" labelWidth={8}>
                <Input
                  placeholder="Step"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.step = Number(event.target.value);
                    onChange(parameters);
                  }}
                  type="number"
                  width={10}
                  value={parameter.step}
                />
              </InlineField>
            </InlineFieldRow>
          )}

          {(parameter.type === InputParameterType.RADIO || parameter.type === InputParameterType.SELECT) && (
            <div>
              {Array.from(parameter.options || []).map((option) => (
                <InlineFieldRow key={parameter.id}>
                  <InlineField label="Value" labelWidth={8}>
                    <Input
                      placeholder="value"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        option.value = event.target.value;
                        onChange(parameters);
                      }}
                      value={option.value}
                    />
                  </InlineField>
                  <InlineField label="Label" labelWidth={8} grow>
                    <Input
                      placeholder="label"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        option.label = event.target.value;
                        onChange(parameters);
                      }}
                      value={option.label}
                    />
                  </InlineField>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      parameter.options = parameter.options?.filter((o) => o.value !== option.value);
                      onChange(parameters);
                    }}
                    icon="minus"
                  ></Button>
                </InlineFieldRow>
              ))}

              <Button
                variant="secondary"
                onClick={(e) => {
                  if (parameter.options) {
                    parameter.options.push(InputParameterOptionDefault);
                  } else {
                    parameter.options = [InputParameterOptionDefault];
                  }

                  onChange(parameters);
                }}
                icon="plus"
              >
                Add Option
              </Button>
            </div>
          )}
        </FieldSet>
      ))}

      <FieldSet label="New Parameter">
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
          disabled={!!!newParameter.id || !!!newParameter.type || !!!newParameter.title}
          icon="plus"
        >
          Add Parameter
        </Button>
      </FieldSet>
    </div>
  );
};
