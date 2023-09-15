import React, { ChangeEvent, useMemo } from 'react';
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
} from '@grafana/ui';
import { BooleanElementOptions, CodeEditorHeight, CodeLanguage, FormElementType, TestIds } from '../../constants';
import { ApplyWidth, FormatNumberValue, ToNumberValue } from '../../utils';
import { cx } from '@emotion/css';
import { DateTime, dateTime, PanelData } from '@grafana/data';
import Slider from 'rc-slider';
import { LocalFormElement } from '../../types';
import { Styles } from '../../styles';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   *
   * @type {LocalFormElement}
   */
  element: LocalFormElement;

  /**
   * On Change
   */
  onChange: <T extends LocalFormElement>(element: T) => void;

  /**
   * Highlight Class
   */
  highlightClass: (element: LocalFormElement) => string;

  /**
   * Data
   */
  data: PanelData;
}

/**
 * Form Element
 */
export const FormElement: React.FC<Props> = ({ element, onChange, highlightClass, data }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Options
   */
  const options = useMemo(() => element.helpers.getOptions({ data }), [data, element.helpers]);

  return (
    <InlineFieldRow data-testid={TestIds.formElements.element(element.id, element.type)}>
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

              onChange<typeof element>({
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
              onChange<typeof element>({
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
              onChange<typeof element>({
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
              !options.length ? element.value || '' : options.find((option) => option.value === element.value)?.label
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
              onChange<typeof element>({
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
              onChange<typeof element>({
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
              onChange<typeof element>({
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
              onChange<typeof element>({
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
                onChange<typeof element>({
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
                onChange<typeof element>({
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
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            fullWidth={!element.width}
            options={options}
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
              onChange<typeof element>({
                ...element,
                value: Array.isArray(event) ? event.map(({ value }) => value) : event.value,
              });
            }}
            width={ApplyWidth(element.width)}
            options={options}
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
                onChange<typeof element>({
                  ...element,
                  value: files,
                });
              },
            }}
            onFileRemove={(removedItem) => {
              onChange<typeof element>({
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
};
