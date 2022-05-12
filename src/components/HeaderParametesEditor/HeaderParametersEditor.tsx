import React, { ChangeEvent } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { HeaderParameter } from '../../types';

/**
 * Properties
 */
interface Props extends StandardEditorProps<HeaderParameter[]> {}

/**
 * Header Parameters Editor
 */
export const HeaderParametersEditor: React.FC<Props> = ({ value: parameters, onChange }) => {
  if (!parameters || !parameters.length) {
    parameters = [];
  }

  /**
   * Return
   */
  return (
    <div>
      {parameters.map((parameter, id) => (
        <InlineFieldRow key={id}>
          <InlineField label="Name" labelWidth={8}>
            <Input
              placeholder="name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                parameter.name = event.target.value;
                onChange(parameters);
              }}
              value={parameter.name}
            />
          </InlineField>
          <InlineField label="Value" labelWidth={8} grow>
            <Input
              placeholder="value"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                parameter.value = event.target.value;
                onChange(parameters);
              }}
              type="password"
              value={parameter.value}
            />
          </InlineField>
          <Button
            variant="secondary"
            onClick={(e) => {
              parameters = parameters?.filter((p) => p.name !== parameter.name);
              onChange(parameters);
            }}
            icon="minus"
          ></Button>
        </InlineFieldRow>
      ))}

      <Button
        variant="secondary"
        onClick={(e) => {
          if (parameters) {
            parameters.push({ name: '', value: '' });
          } else {
            parameters = [{ name: '', value: '' }];
          }

          onChange(parameters);
        }}
        icon="plus"
      >
        Add Parameter
      </Button>
    </div>
  );
};
