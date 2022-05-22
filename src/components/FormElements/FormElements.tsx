import React, { ChangeEvent } from 'react';
import { DateTime, SelectableValue } from '@grafana/data';
import {
  CodeEditor,
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
import { BooleanElementOptions, CodeEditorHeight, CodeLanguage, FormElementType } from '../../constants';
import { LayoutSection, PanelOptions } from '../../types';

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
   * Section
   */
  section: LayoutSection | null;
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({ options, onOptionsChange, section }) => {
  return (
    <div>
      {options.elements.map((element) => {
        /**
         * Skip Hidden Elements
         */
        if (section && element.section !== section.name) {
          return;
        }

        /**
         * Return
         */
        return (
          <InlineFieldRow key={element.id}>
            {element.type === FormElementType.NUMBER && (
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
                transparent={!!!element.title}
              >
                <Input value={element.value} type="text" />
              </InlineField>
            )}

            {element.type === FormElementType.TEXTAREA && (
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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

            {element.type === FormElementType.CODE && (
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
                <CodeEditor
                  language={element.language || CodeLanguage.JAVASCRIPT}
                  showLineNumbers={true}
                  showMiniMap={true}
                  value={element.value}
                  height={element.height || `${CodeEditorHeight}px`}
                  onBlur={(code) => {
                    element.value = code;
                    onOptionsChange(options);
                  }}
                />
              </InlineField>
            )}

            {element.type === FormElementType.BOOLEAN && (
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
              <InlineField
                label={element.title}
                grow
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
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
