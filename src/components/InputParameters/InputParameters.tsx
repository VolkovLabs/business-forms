import React, { ChangeEvent } from 'react';
import { DateTime, SelectableValue } from '@grafana/data';
import {
  DateTimePicker,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  Input,
  RadioButtonGroup,
  Select,
  Slider,
  TextArea,
} from '@grafana/ui';
import { BooleanParameterOptions, InputParameterType } from '../../constants';
import { PanelOptions } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Options
   *
   * @type {PanelOptions}
   */
  options: PanelOptions;

  /**
   * On Options Change
   */
  onOptionsChange: any;

  /**
   * Display
   */
  display?: InputParameterType[];

  /**
   * Hide
   */
  hide?: InputParameterType[];
}

/**
 * Input Parameters
 */
export const InputParameters: React.FC<Props> = ({ options, onOptionsChange, display, hide }) => {
  return (
    <div>
      {options.parameters.map((parameter) => {
        /**
         * Skip Hidden Parameters
         */
        if (hide?.length && hide.indexOf(parameter.type) > -1) {
          return;
        }

        if (display?.length && display.indexOf(parameter.type) === -1) {
          return;
        }

        /**
         * Return
         */
        return (
          <InlineFieldRow key={parameter.id}>
            {parameter.type === InputParameterType.NUMBER && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Input
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  type="number"
                  min={parameter.min !== null ? parameter.min : ''}
                  max={parameter.max !== null ? parameter.max : ''}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.STRING && (
              <InlineField label={parameter.title} grow labelWidth={10} invalid={parameter.value === ''}>
                <Input
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    parameter.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  type="text"
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.DISABLED && (
              <InlineField label={parameter.title} grow labelWidth={10} disabled>
                <Input value={parameter.value} type="text" />
              </InlineField>
            )}

            {parameter.type === InputParameterType.TEXTAREA && (
              <InlineField label={parameter.title} grow labelWidth={10} invalid={parameter.value === ''}>
                <TextArea
                  value={parameter.value}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    parameter.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  rows={parameter.rows}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.BOOLEAN && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <RadioButtonGroup
                  value={parameter.value}
                  onChange={(value: Boolean) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  options={BooleanParameterOptions}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.DATETIME && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <DateTimePicker
                  date={parameter.value}
                  onChange={(dateTime: DateTime) => {
                    parameter.value = dateTime;
                    onOptionsChange(options);
                  }}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.SLIDER && parameter.value != null && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Slider
                  value={parameter.value || 0}
                  onChange={(value: number) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  min={parameter.min || 0}
                  max={parameter.max || 0}
                  step={parameter.step || 0}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.RADIO && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <RadioButtonGroup
                  value={parameter.value}
                  onChange={(value: any) => {
                    parameter.value = value;
                    onOptionsChange(options);
                  }}
                  options={parameter.options || []}
                />
              </InlineField>
            )}

            {parameter.type === InputParameterType.SELECT && (
              <InlineField label={parameter.title} grow labelWidth={10}>
                <Select
                  value={parameter.value}
                  onChange={(event: SelectableValue) => {
                    parameter.value = event?.value;
                    onOptionsChange(options);
                  }}
                  options={parameter.options || []}
                />
              </InlineField>
            )}

            {parameter.unit && (
              <InlineLabel transparent width={4}>
                {parameter.unit}
              </InlineLabel>
            )}
          </InlineFieldRow>
        );
      })}
    </div>
  );
};
