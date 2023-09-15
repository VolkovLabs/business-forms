import Slider from 'rc-slider';
import React, { ChangeEvent, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { dateTime, DateTime, InterpolateFunction, PanelData } from '@grafana/data';
import {
  CodeEditor,
  DateTimePicker,
  FileDropzone,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  Input,
  RadioButtonGroup,
  Select,
  TextArea,
  useStyles2,
  useTheme2,
} from '@grafana/ui';
import {
  BooleanElementOptions,
  CodeEditorHeight,
  CodeLanguage,
  FormElementType,
  InitialHighlightColorDefault,
  TestIds,
} from '../../constants';
import { Styles } from '../../styles';
import { LayoutSection, LocalFormElement, PanelOptions } from '../../types';
import { ApplyWidth, FormatNumberValue, GetLayoutUniqueId, ToNumberValue } from '../../utils';

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
   * Elements
   */
  elements: LocalFormElement[];

  /**
   * On Element Change
   */
  onChangeElement: <T extends LocalFormElement>(element: T) => void;

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

  /**
   * Template variables interpolation function
   */
  replaceVariables: InterpolateFunction;

  /**
   * Data
   */
  data: PanelData;
}

/**
 * Form Elements
 */
export const FormElements: React.FC<Props> = ({
  options,
  elements,
  onChangeElement,
  section,
  initial,
  replaceVariables,
  data,
}) => {
  /**
   * Theme and Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(Styles);

  /**
   * Highlight Color
   */
  const highlightColor = theme.visualization.getColorByName(
    options.initial.highlightColor || InitialHighlightColorDefault
  );

  /**
   * Highlight CSS
   */
  const highlightClass = (element: LocalFormElement) => {
    return options.initial.highlight && Object.keys(initial).length && initial[element.id] !== element.value
      ? css`
          -webkit-text-fill-color: ${highlightColor};
        `
      : css`
          -webkit-text-fill-color: ${theme.colors.text.primary};
        `;
  };

  /**
   * Visible Elements
   */
  const visibleElements = useMemo(() => {
    return elements.filter((element) => {
      return element.helpers.showIf({ elements, replaceVariables });
    });
  }, [elements, replaceVariables]);

  return (
    <div data-testid={TestIds.formElements.root}>
      {visibleElements.map((element, index) => {
        /**
         * Skip Hidden Elements
         */
        if (section && element.section !== GetLayoutUniqueId(section)) {
          return;
        }

        /**
         * Return
         */
        return (
          <InlineFieldRow key={index} data-testid={TestIds.formElements.element(element.id, element.type)}>
            {element.type === FormElementType.NUMBER && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Input
                  value={element.value || ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    let value = ToNumberValue(event.target.value);

                    /**
                     * Validate Maximum
                     */
                    if (element.max !== undefined && element.max !== null) {
                      value = Math.min(element.max, value || 0);
                    }

                    /**
                     * Validate Minimum
                     */
                    if (element.min !== undefined && element.min !== null) {
                      value = Math.max(element.min, value || 0);
                    }

                    onChangeElement<typeof element>({
                      ...element,
                      value,
                    });
                  }}
                  type="number"
                  className={highlightClass(element)}
                  width={ApplyWidth(element.width)}
                  min={FormatNumberValue(element.min)}
                  max={FormatNumberValue(element.max)}
                  data-testid={TestIds.formElements.fieldNumber}
                />
              </InlineField>
            )}

            {element.type === FormElementType.STRING && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
                className={cx(element.hidden && styles.hidden)}
              >
                <Input
                  value={element.value || ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  width={ApplyWidth(element.width)}
                  type="text"
                  data-testid={TestIds.formElements.fieldString}
                />
              </InlineField>
            )}

            {element.type === FormElementType.PASSWORD && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Input
                  value={element.value || ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  width={ApplyWidth(element.width)}
                  type="password"
                  data-testid={TestIds.formElements.fieldPassword}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DISABLED && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                disabled
                transparent={!element.title}
              >
                <Input
                  value={
                    !element.helpers.getOptions({ data }).length
                      ? element.value || ''
                      : element.helpers.getOptions({ data }).find((option) => option.value === element.value)?.label
                  }
                  type="text"
                  width={ApplyWidth(element.width)}
                  data-testid={TestIds.formElements.fieldDisabled}
                />
              </InlineField>
            )}

            {(element.type === FormElementType.TEXTAREA || element.type === FormElementType.DISABLED_TEXTAREA) && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
                disabled={element.type === FormElementType.DISABLED_TEXTAREA}
              >
                <TextArea
                  value={element.value || ''}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: event.target.value,
                    });
                  }}
                  className={highlightClass(element)}
                  cols={ApplyWidth(element.width)}
                  rows={element.rows}
                  data-testid={TestIds.formElements.fieldTextarea}
                />
              </InlineField>
            )}

            {element.type === FormElementType.CODE && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <CodeEditor
                  language={element.language || CodeLanguage.JAVASCRIPT}
                  showLineNumbers={true}
                  showMiniMap={(element.value && element.value.length) > 100}
                  value={element.value || ''}
                  height={element.height || `${CodeEditorHeight}px`}
                  width={ApplyWidth(element.width)}
                  onBlur={(code) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: code,
                    });
                  }}
                  monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                  aria-label={TestIds.formElements.fieldCode}
                />
              </InlineField>
            )}

            {element.type === FormElementType.BOOLEAN && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
                data-testid={TestIds.formElements.fieldBooleanContainer}
              >
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: Boolean) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value,
                    });
                  }}
                  className={highlightClass(element)}
                  fullWidth={!element.width}
                  options={BooleanElementOptions}
                />
              </InlineField>
            )}

            {element.type === FormElementType.DATETIME && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <DateTimePicker
                  minDate={element.min ? new Date(element.min) : undefined}
                  maxDate={element.max ? new Date(element.max) : undefined}
                  date={dateTime(element.value)}
                  onChange={(dateTime: DateTime) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: dateTime.toISOString(),
                    });
                  }}
                  data-testid={TestIds.formElements.fieldDateTime}
                />
              </InlineField>
            )}

            {element.type === FormElementType.SLIDER && element.value != null && (
              <>
                <InlineField
                  label={element.title}
                  grow={!element.width}
                  labelWidth={ApplyWidth(element.labelWidth)}
                  tooltip={element.tooltip}
                  transparent={!element.title}
                  className={cx(styles.slider)}
                >
                  <Slider
                    value={element.value || 0}
                    onChange={(value) => {
                      onChangeElement<typeof element>({
                        ...element,
                        value: Array.isArray(value) ? value[value.length - 1] : value,
                      });
                    }}
                    min={element.min || 0}
                    max={element.max || 0}
                    step={element.step || 0}
                    ariaLabelForHandle={TestIds.formElements.fieldSlider}
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
                      onChangeElement<typeof element>({
                        ...element,
                        value: Math.max(element.min || 0, Math.min(element.max || 0, Number(e.currentTarget.value))),
                      });
                    }}
                    data-testid={TestIds.formElements.fieldSliderInput}
                  />
                </InlineField>
              </>
            )}

            {element.type === FormElementType.RADIO && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
                data-testid={TestIds.formElements.fieldRadioContainer}
              >
                <RadioButtonGroup
                  value={element.value}
                  onChange={(value: unknown) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value,
                    });
                  }}
                  fullWidth={!element.width}
                  options={element.helpers.getOptions({ data })}
                  className={highlightClass(element)}
                />
              </InlineField>
            )}

            {(element.type === FormElementType.SELECT || element.type === FormElementType.MULTISELECT) && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <Select
                  isMulti={element.type === FormElementType.MULTISELECT}
                  aria-label={TestIds.formElements.fieldSelect}
                  value={element.value !== undefined ? element.value : null}
                  onChange={(event) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: Array.isArray(event) ? event.map(({ value }) => value) : event.value,
                    });
                  }}
                  width={ApplyWidth(element.width)}
                  options={element.helpers.getOptions({ data })}
                  className={highlightClass(element)}
                />
              </InlineField>
            )}

            {element.type === FormElementType.FILE && (
              <InlineField
                label={element.title}
                grow={!element.width}
                labelWidth={ApplyWidth(element.labelWidth)}
                tooltip={element.tooltip}
                transparent={!element.title}
              >
                <FileDropzone
                  options={{
                    accept: element.accept || undefined,
                    multiple: true,
                    onDrop: (files: File[]) => {
                      onChangeElement<typeof element>({
                        ...element,
                        value: files,
                      });
                    },
                  }}
                  onFileRemove={(removedItem) => {
                    onChangeElement<typeof element>({
                      ...element,
                      value: element.value.filter((item: File) => item.name !== removedItem.file.name),
                    });
                  }}
                  data-testid={TestIds.formElements.fieldFile}
                />
              </InlineField>
            )}

            {element.unit && (
              <InlineLabel data-testid={TestIds.formElements.unit} transparent width={4}>
                {element.unit}
              </InlineLabel>
            )}
          </InlineFieldRow>
        );
      })}
    </div>
  );
};
