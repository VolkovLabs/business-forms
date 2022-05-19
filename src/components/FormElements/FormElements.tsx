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
import { BooleanElementOptions, FormElementType } from '../../constants';
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
  display?: FormElementType[];

  /**
   * Hide
   */
  hide?: FormElementType[];
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({ options, onOptionsChange, display, hide }) => {
  return (
    <div>
      {options.elements.map((element) => {
        /**
         * Skip Hidden Elements
         */
        if (hide?.length && hide.indexOf(element.type) > -1) {
          return;
        }

        if (display?.length && display.indexOf(element.type) === -1) {
          return;
        }

        /**
         * Return
         */
        return (
          <InlineFieldRow key={element.id}>
            {element.type === FormElementType.NUMBER && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  type="number"
                  min={element.min !== null ? element.min : ''}
                  max={element.max !== null ? element.max : ''}
                />
              </InlineField>
            )}

            {element.type === FormElementType.STRING && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  type="text"
                />
              </InlineField>
            )}

            {element.type === FormElementType.PASSWORD && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  type="password"
                />
              </InlineField>
            )}

            {element.type === FormElementType.DISABLED && (
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                disabled
              >
                <Input value={element.value} type="text" />
              </InlineField>
            )}

            {element.type === FormElementType.TEXTAREA && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <TextArea
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    element.value = event.target.value;
                    onOptionsChange(options);
                  }}
                  rows={element.rows}
                />
              </InlineField>
            )}

            {element.type === FormElementType.BOOLEAN && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: Boolean) => {
                    element.value = value;
                    onOptionsChange(options);
                  }}
                  options={BooleanElementOptions}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DATETIME && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <DateTimePicker
                  date={element.value}
                  onChange={(dateTime: DateTime) => {
                    element.value = dateTime;
                    onOptionsChange(options);
                  }}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SLIDER && element.value != null && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <Slider
                  value={element.value || 0}
                  onChange={(value: number) => {
                    element.value = value;
                    onOptionsChange(options);
                  }}
                  min={element.min || 0}
                  max={element.max || 0}
                  step={element.step || 0}
                />
              </InlineField>
            )}

            {element.type === FormElementType.RADIO && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: any) => {
                    element.value = value;
                    onOptionsChange(options);
                  }}
                  options={element.options || []}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SELECT && (
              <InlineField label={element.title} grow labelWidth={element.labelWidth} tooltip={element.tooltip}>
                <Select
                  value={element.value}
                  onChange={(event: SelectableValue) => {
                    element.value = event?.value;
                    onOptionsChange(options);
                  }}
                  options={element.options || []}
                />
              </InlineField>
            )}

            {element.unit && (
              <InlineLabel transparent width={4}>
                {element.unit}
              </InlineLabel>
            )}
          </InlineFieldRow>
        );
      })}
    </div>
  );
};
