import { cx } from '@emotion/css';
import { DateTime, dateTime, PanelData } from '@grafana/data';
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
  TextLink,
  useStyles2,
  useTheme2,
} from '@grafana/ui';
import { NumberInput } from '@volkovlabs/components';
import Slider from 'rc-slider';
import React, { ChangeEvent, useMemo } from 'react';

import { BooleanElementOptions, CodeEditorHeight, FormElementType, TestIds } from '../../constants';
import { Styles } from '../../styles';
import { CodeLanguage, LinkTarget, LocalFormElement } from '../../types';
import { ApplyWidth, FormatNumberValue, IsFormElementType } from '../../utils';

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
   * Styles and Theme
   */
  const theme = useTheme2();
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
          <NumberInput
            value={FormatNumberValue(element.value)}
            onChange={(value: number) => {
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            type="number"
            className={highlightClass(element)}
            width={ApplyWidth(element.width)}
            min={element.min}
            max={element.max}
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
          className={cx({
            [styles.hidden]: element.hidden,
          })}
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

      {IsFormElementType(element, FormElementType.PASSWORD) && (
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

      {IsFormElementType(element, FormElementType.DISABLED) && (
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
              !options.length
                ? element.value?.toString() || ''
                : options.find((option) => option.value === element.value)?.label
            }
            type="text"
            width={ApplyWidth(element.width)}
            data-testid={TestIds.formElements.fieldDisabled}
          />
        </InlineField>
      )}

      {IsFormElementType(element, FormElementType.TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={ApplyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
        >
          <TextArea
            value={element.value}
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

      {IsFormElementType(element, FormElementType.DISABLED_TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={ApplyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.type === FormElementType.DISABLED_TEXTAREA}
        >
          <TextArea
            value={element.value}
            className={highlightClass(element)}
            cols={ApplyWidth(element.width)}
            rows={element.rows}
            data-testid={TestIds.formElements.fieldDisabledTextarea}
          />
        </InlineField>
      )}

      {IsFormElementType(element, FormElementType.CODE) && (
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
            showMiniMap={(element.value?.length || 0) > 100}
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

      {IsFormElementType(element, FormElementType.BOOLEAN) && (
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
            onChange={(value: boolean) => {
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
                value: element.value?.filter((item: File) => item.name !== removedItem.file.name) || [],
              });
            }}
            data-testid={TestIds.formElements.fieldFile}
          />
        </InlineField>
      )}

      {element.type === FormElementType.LINK && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={ApplyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
        >
          <div className={styles.link} style={{ width: element.width ? theme.spacing(element.width) : 'auto' }}>
            <TextLink href={element.value} external={element.target === LinkTarget.NEW_TAB}>
              {element.linkText || element.value}
            </TextLink>
          </div>
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
