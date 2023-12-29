import { cx } from '@emotion/css';
import { DateTime, dateTime } from '@grafana/data';
import {
  DatePickerWithInput,
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
import React, { ChangeEvent } from 'react';

import { BOOLEAN_ELEMENT_OPTIONS, FormElementType, TEST_IDS } from '../../constants';
import { CodeLanguage, LinkTarget, LocalFormElement } from '../../types';
import { applyWidth, formatNumberValue, isFormElementType } from '../../utils';
import { AutosizeCodeEditor } from '../AutosizeCodeEditor';
import { getStyles } from './FormElement.styles';

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
}

/**
 * Form Element
 */
export const FormElement: React.FC<Props> = ({ element, onChange, highlightClass }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  return (
    <InlineFieldRow data-testid={TEST_IDS.formElements.element(element.id, element.type)}>
      {element.type === FormElementType.NUMBER && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
        >
          <NumberInput
            value={formatNumberValue(element.value)}
            onChange={(value: number) => {
              onChange<typeof element>({
                ...element,
                value,
              });
            }}
            type="number"
            className={highlightClass(element)}
            width={applyWidth(element.width)}
            min={element.min}
            max={element.max}
            data-testid={TEST_IDS.formElements.fieldNumber}
          />
        </InlineField>
      )}

      {element.type === FormElementType.STRING && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          className={cx({
            [styles.hidden]: element.hidden,
          })}
          disabled={element.disabled}
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
            width={applyWidth(element.width)}
            type="text"
            data-testid={TEST_IDS.formElements.fieldString}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.PASSWORD) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
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
            width={applyWidth(element.width)}
            type="password"
            data-testid={TEST_IDS.formElements.fieldPassword}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.DISABLED) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          disabled
          transparent={!element.title}
        >
          <Input
            value={
              !element.options?.length
                ? element.value?.toString() || ''
                : element.options?.find((option) => option.value === element.value)?.label
            }
            type="text"
            width={applyWidth(element.width)}
            data-testid={TEST_IDS.formElements.fieldDisabled}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
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
            cols={applyWidth(element.width)}
            rows={element.rows}
            data-testid={TEST_IDS.formElements.fieldTextarea}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.DISABLED_TEXTAREA) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.type === FormElementType.DISABLED_TEXTAREA}
        >
          <TextArea
            value={element.value}
            className={highlightClass(element)}
            cols={applyWidth(element.width)}
            rows={element.rows}
            data-testid={TEST_IDS.formElements.fieldDisabledTextarea}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.CODE) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
        >
          <AutosizeCodeEditor
            language={element.language || CodeLanguage.JAVASCRIPT}
            showLineNumbers={true}
            showMiniMap={(element.value?.length || 0) > 100}
            value={element.value || ''}
            height={element.height}
            width={applyWidth(element.width)}
            onBlur={(code) => {
              onChange<typeof element>({
                ...element,
                value: code,
              });
            }}
            monacoOptions={{ formatOnPaste: true, formatOnType: true }}
            aria-label={TEST_IDS.formElements.fieldCode}
            readOnly={element.disabled}
          />
        </InlineField>
      )}

      {isFormElementType(element, FormElementType.BOOLEAN) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          data-testid={TEST_IDS.formElements.fieldBooleanContainer}
          disabled={element.disabled}
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
            options={BOOLEAN_ELEMENT_OPTIONS}
          />
        </InlineField>
      )}

      {element.type === FormElementType.DATETIME && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
        >
          {element.disabled ? (
            <DatePickerWithInput
              onChange={undefined as never}
              value={element.value}
              data-testid={TEST_IDS.formElements.fieldDateTime}
            />
          ) : (
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
              data-testid={TEST_IDS.formElements.fieldDateTime}
            />
          )}
        </InlineField>
      )}

      {element.type === FormElementType.SLIDER && element.value != null && (
        <>
          <InlineField
            label={element.title}
            grow={!element.width}
            labelWidth={applyWidth(element.labelWidth)}
            tooltip={element.tooltip}
            transparent={!element.title}
            className={cx(styles.slider)}
            disabled={element.disabled}
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
              ariaLabelForHandle={TEST_IDS.formElements.fieldSlider}
            />
          </InlineField>
          <InlineField className={cx(styles.sliderInput)} disabled={element.disabled}>
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
              data-testid={TEST_IDS.formElements.fieldSliderInput}
            />
          </InlineField>
        </>
      )}

      {element.type === FormElementType.RADIO && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          data-testid={TEST_IDS.formElements.fieldRadioContainer}
          disabled={element.disabled}
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
            options={element.options}
            className={highlightClass(element)}
          />
        </InlineField>
      )}

      {(element.type === FormElementType.SELECT || element.type === FormElementType.MULTISELECT) && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
        >
          <Select
            isMulti={element.type === FormElementType.MULTISELECT}
            aria-label={TEST_IDS.formElements.fieldSelect}
            value={element.value !== undefined ? element.value : null}
            onChange={(event) => {
              onChange<typeof element>({
                ...element,
                value: Array.isArray(event) ? event.map(({ value }) => value) : event.value,
              });
            }}
            width={applyWidth(element.width)}
            options={element.options}
            className={highlightClass(element)}
          />
        </InlineField>
      )}

      {element.type === FormElementType.FILE && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
          disabled={element.disabled}
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
            data-testid={TEST_IDS.formElements.fieldFile}
          />
        </InlineField>
      )}

      {element.type === FormElementType.LINK && (
        <InlineField
          label={element.title}
          grow={!element.width}
          labelWidth={applyWidth(element.labelWidth)}
          tooltip={element.tooltip}
          transparent={!element.title}
        >
          <div className={styles.link} style={{ width: element.width ? theme.spacing(element.width) : 'auto' }}>
            <TextLink
              href={element.value}
              external={element.target === LinkTarget.NEW_TAB}
              data-testid={TEST_IDS.formElements.link}
            >
              {element.linkText || element.value}
            </TextLink>
          </div>
        </InlineField>
      )}

      {element.unit && (
        <InlineLabel data-testid={TEST_IDS.formElements.unit} transparent width={4}>
          {element.unit}
        </InlineLabel>
      )}
    </InlineFieldRow>
  );
};
