import Slider from 'rc-slider';
import React, { ChangeEvent } from 'react';
import { css, cx } from '@emotion/css';
import { dateTime, DateTime, SelectableValue } from '@grafana/data';
import {
  CodeEditor,
  DateTimePicker,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  Input,
  RadioButtonGroup,
  Select,
  TextArea,
  useTheme2,
} from '@grafana/ui';
import {
  BooleanElementOptions,
  CodeEditorHeight,
  CodeLanguage,
  FormElementType,
  InitialHighlightColorDefault,
} from '../../constants';
import { getStyles } from '../../styles';
import { FormElement, LayoutSection, PanelOptions } from '../../types';

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
   * Initial values
   *
   * @type {[id: string]: any}
   */
  initial: { [id: string]: any };

  /**
   * Section
   */
  section: LayoutSection | null;
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({ options, onOptionsChange, section, initial }) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Highlight Color
   */
  const highlightColor = theme.visualization.getColorByName(
    options.initial.highlightColor || InitialHighlightColorDefault
  );

  /**
   * Highlight CSS
   */
  const highlightClass = (element: FormElement) => {
    return options.initial.highlight && Object.keys(initial).length && initial[element.id] !== element.value
      ? css`
          -webkit-text-fill-color: ${highlightColor};
        `
      : css`
          -webkit-text-fill-color: ${theme.colors.text.primary};
        `;
  };

  return (
    <div>
      {options.elements?.map((element) => {
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
                grow={!!!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
                <Input
                  value={element.value}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.value = event.target.value;

                    /**
                     * Validate Maximum
                     */
                    if (element.max !== undefined && element.max !== null) {
                      element.value = Math.min(element.max, Number(element.value));
                    }

                    /**
                     * Validate Minimum
                     */
                    if (element.min !== undefined && element.min !== null) {
                      element.value = Math.max(element.min, Number(element.value));
                    }

                    onOptionsChange(options);
                  }}
                  type="number"
                  className={highlightClass(element)}
                  width={element.width}
                  min={element.min !== null ? element.min : ''}
                  max={element.max !== null ? element.max : ''}
                />
              </InlineField>
            )}

            {element.type === FormElementType.STRING && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  className={highlightClass(element)}
                  width={element.width}
                  type="text"
                />
              </InlineField>
            )}

            {element.type === FormElementType.PASSWORD && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  className={highlightClass(element)}
                  width={element.width}
                  type="password"
                />
              </InlineField>
            )}

            {element.type === FormElementType.DISABLED && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                disabled
                transparent={!!!element.title}
              >
                <Input
                  value={
                    !element.options?.length
                      ? element.value
                      : element.options.find((option) => option.value === element.value)?.label
                  }
                  type="text"
                  width={element.width}
                />
              </InlineField>
            )}

            {element.type === FormElementType.TEXTAREA && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  className={highlightClass(element)}
                  cols={element.width}
                  rows={element.rows}
                />
              </InlineField>
            )}

            {element.type === FormElementType.CODE && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
                <CodeEditor
                  language={element.language || CodeLanguage.JAVASCRIPT}
                  showLineNumbers={true}
                  showMiniMap={(element.value && element.value.length) > 100}
                  value={element.value}
                  height={element.height || `${CodeEditorHeight}px`}
                  width={element.width}
                  onBlur={(code) => {
                    element.value = code;
                    onOptionsChange(options);
                  }}
                  monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                />
              </InlineField>
            )}

            {element.type === FormElementType.BOOLEAN && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  className={highlightClass(element)}
                  fullWidth={!!!element.width}
                  options={BooleanElementOptions}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DATETIME && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
                labelWidth={element.labelWidth}
                tooltip={element.tooltip}
                transparent={!!!element.title}
              >
                <DateTimePicker
                  date={dateTime(element.value)}
                  onChange={(dateTime: DateTime) => {
                    element.value = dateTime;
                    onOptionsChange(options);
                  }}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SLIDER && element.value != null && (
              <>
                <InlineField
                  label={element.title}
                  grow={!!!element.width}
                  labelWidth={element.labelWidth}
                  tooltip={element.tooltip}
                  transparent={!!!element.title}
                  className={cx(styles.slider)}
                >
                  <Slider
                    value={element.value || 0}
                    onChange={(value: number | number[]) => {
                      element.value = value;
                      onOptionsChange(options);
                    }}
                    min={element.min || 0}
                    max={element.max || 0}
                    step={element.step || 0}
                  />
                </InlineField>
                <InlineField className={cx(styles.sliderInput)}>
                  <Input
                    type="number"
                    width={8}
                    min={element.min || 0}
                    max={element.max || 0}
                    value={element.value || 0}
                    onChange={(e) => {
                      element.value = Math.max(
                        element.min || 0,
                        Math.min(element.max || 0, Number(e.currentTarget.value))
                      );
                      onOptionsChange(options);
                    }}
                  ></Input>
                </InlineField>
              </>
            )}

            {element.type === FormElementType.RADIO && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  fullWidth={!!!element.width}
                  options={element.options || []}
                  className={highlightClass(element)}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SELECT && (
              <InlineField
                label={element.title}
                grow={!!!element.width}
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
                  width={element.width}
                  options={element.options || []}
                  className={highlightClass(element)}
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
