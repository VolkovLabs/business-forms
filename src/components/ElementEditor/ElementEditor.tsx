import React, { ChangeEvent } from 'react';
import { SelectableValue } from '@grafana/data';
import {
  Button,
  CodeEditor,
  Field,
  InlineField,
  InlineFieldRow,
  Input,
  RadioButtonGroup,
  Select,
  useStyles2,
} from '@grafana/ui';
import {
  CodeEditorHeight,
  CodeLanguage,
  CodeLanguageOptions,
  FormElementType,
  FormElementTypeOptions,
  RequestMethod,
  SelectElementOptions,
  StringElementOptions,
  TestIds,
} from '../../constants';
import { LocalFormElement } from '../../types';
import { FormatNumberValue, GetElementWithNewType, ToNumberValue } from '../../utils';
import { ElementDateEditor } from '../ElementDateEditor';
import { Styles } from './styles';

/**
 * Properties
 */
interface Props {
  /**
   * Element
   */
  element: LocalFormElement;

  /**
   * On Change
   */
  onChange: (element: LocalFormElement, checkConflict?: boolean) => void;

  /**
   * On Change Option
   */
  onChangeOption: (
    element: LocalFormElement,
    updatedOption: SelectableValue,
    value?: SelectableValue,
    checkConflict?: boolean
  ) => void;

  /**
   * Layout Section Options
   */
  layoutSectionOptions: SelectableValue[];

  /**
   * Initial Request Method
   */
  initialMethod: RequestMethod;
}

/**
 * Element Editor
 */
export const ElementEditor: React.FC<Props> = ({
  element,
  onChange,
  onChangeOption,
  layoutSectionOptions,
  initialMethod,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Return
   */
  return (
    <>
      <InlineFieldRow>
        <InlineField label="Id" grow labelWidth={8} invalid={element.id === ''}>
          <Input
            placeholder="Id"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange(
                {
                  ...element,
                  id: event.target.value,
                },
                true
              );
            }}
            value={element.id}
            data-testid={TestIds.formElementsEditor.fieldId}
          />
        </InlineField>

        {element.type === FormElementType.STRING && (
          <InlineField data-testid={TestIds.formElementsEditor.fieldVisibility}>
            <RadioButtonGroup
              options={StringElementOptions}
              value={!!element.hidden}
              onChange={(value) => {
                onChange({
                  ...element,
                  hidden: value,
                });
              }}
            />
          </InlineField>
        )}
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField label="Type" grow labelWidth={8}>
          <Select
            options={FormElementTypeOptions}
            onChange={(event: SelectableValue) => {
              onChange(GetElementWithNewType(element, event?.value), true);
            }}
            value={FormElementTypeOptions.find((type) => type.value === element.type)}
            aria-label={TestIds.formElementsEditor.fieldType}
          />
        </InlineField>

        <InlineField
          label="Width"
          labelWidth={12}
          tooltip="Element will grow to max length if not specified. Some elements does not support adjusting width."
        >
          <Input
            placeholder="auto"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                width: ToNumberValue(event.target.value),
              });
            }}
            value={FormatNumberValue(element.width)}
            min={0}
            type="number"
            data-testid={TestIds.formElementsEditor.fieldWidth}
          />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField label="Label" grow labelWidth={8} invalid={element.title === ''}>
          <Input
            placeholder="Label"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                title: event.target.value,
              });
            }}
            value={element.title}
            data-testid={TestIds.formElementsEditor.fieldLabel}
          />
        </InlineField>

        <InlineField label="Label Width" labelWidth={12}>
          <Input
            placeholder="auto"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                labelWidth: ToNumberValue(event.target.value),
              });
            }}
            value={FormatNumberValue(element.labelWidth)}
            type="number"
            data-testid={TestIds.formElementsEditor.fieldLabelWidth}
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow>
        <InlineField label="Tooltip" grow labelWidth={8}>
          <Input
            placeholder="Tooltip"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                tooltip: event.target.value,
              });
            }}
            value={element.tooltip}
            data-testid={TestIds.formElementsEditor.fieldTooltip}
          />
        </InlineField>

        <InlineField label="Unit" labelWidth={12}>
          <Input
            placeholder="Unit"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                unit: event.target.value,
              });
            }}
            value={element.unit}
            data-testid={TestIds.formElementsEditor.fieldUnit}
          />
        </InlineField>
      </InlineFieldRow>

      {layoutSectionOptions.length > 0 && (
        <InlineFieldRow>
          <InlineField label="Section" grow labelWidth={8}>
            <Select
              options={layoutSectionOptions}
              onChange={(event: SelectableValue) => {
                onChange({
                  ...element,
                  section: event?.value,
                });
              }}
              value={layoutSectionOptions.find((section) => section.value === element.section)}
              aria-label={TestIds.formElementsEditor.fieldSection}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.SLIDER && (
        <InlineFieldRow>
          <InlineField label="Min" labelWidth={8}>
            <Input
              placeholder="Min"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  min: Number(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={element.min}
              data-testid={TestIds.formElementsEditor.fieldSliderMin}
            />
          </InlineField>
          <InlineField label="Max" labelWidth={8}>
            <Input
              placeholder="Max"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  max: Number(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={element.max}
              data-testid={TestIds.formElementsEditor.fieldSliderMax}
            />
          </InlineField>
          <InlineField label="Step" labelWidth={8}>
            <Input
              placeholder="Step"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  step: Number(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={element.step}
              data-testid={TestIds.formElementsEditor.fieldSliderStep}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.NUMBER && (
        <InlineFieldRow>
          <InlineField label="Min" labelWidth={8}>
            <Input
              placeholder="Min"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  min: ToNumberValue(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={FormatNumberValue(element.min)}
              data-testid={TestIds.formElementsEditor.fieldNumberMin}
            />
          </InlineField>
          <InlineField label="Max" labelWidth={8}>
            <Input
              placeholder="Max"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  max: ToNumberValue(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={FormatNumberValue(element.max)}
              data-testid={TestIds.formElementsEditor.fieldNumberMax}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.DATETIME && (
        <>
          <ElementDateEditor
            label="Min"
            onChange={(value) =>
              onChange({
                ...element,
                min: value,
              })
            }
            value={element.min}
            data-testid={TestIds.formElementsEditor.fieldMinDate}
          />
          <ElementDateEditor
            label="Max"
            onChange={(value) =>
              onChange({
                ...element,
                max: value,
              })
            }
            value={element.max}
            data-testid={TestIds.formElementsEditor.fieldMaxDate}
          />
        </>
      )}

      {element.type === FormElementType.TEXTAREA && (
        <InlineFieldRow>
          <InlineField label="Rows" labelWidth={8}>
            <Input
              placeholder="Rows"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  rows: Number(event.target.value),
                });
              }}
              type="number"
              width={10}
              value={element.rows}
              min={2}
              data-testid={TestIds.formElementsEditor.fieldTextareaRows}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.CODE && (
        <InlineFieldRow>
          <InlineField label="Language" grow labelWidth={10}>
            <Select
              options={CodeLanguageOptions}
              onChange={(event: SelectableValue) => {
                onChange({
                  ...element,
                  language: event?.value,
                });
              }}
              value={CodeLanguageOptions.find((language) => language.value === element.language)}
              aria-label={TestIds.formElementsEditor.fieldCodeLanguage}
            />
          </InlineField>
          <InlineField label="Height" labelWidth={12} tooltip="Code Editor height in px">
            <Input
              placeholder="Height"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  height: Number(event.target.value),
                });
              }}
              type="number"
              value={element.height}
              min={0}
              data-testid={TestIds.formElementsEditor.fieldCodeHeight}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {initialMethod === RequestMethod.DATASOURCE && (
        <InlineFieldRow>
          <InlineField
            grow={true}
            label="Field Name"
            labelWidth={14}
            tooltip="Specify a field name from the Data Source response"
          >
            <Input
              value={element.fieldName || ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  fieldName: event.target.value,
                });
              }}
              data-testid={TestIds.formElementsEditor.fieldNamePicker}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {(element.type === FormElementType.RADIO ||
        element.type === FormElementType.SELECT ||
        element.type === FormElementType.MULTISELECT ||
        element.type === FormElementType.DISABLED) && (
        <div className={styles.optionsContainer}>
          {element.options?.map((option, index) => (
            <InlineFieldRow key={index} data-testid={TestIds.formElementsEditor.fieldOption(option.value)}>
              <InlineField label="Type" labelWidth={8}>
                <Select
                  options={SelectElementOptions}
                  onChange={(event: SelectableValue) => {
                    onChangeOption(element, {
                      ...option,
                      type: event?.value,
                    });
                  }}
                  width={12}
                  value={SelectElementOptions.find((type) => type.value === option.type)}
                  aria-label={TestIds.formElementsEditor.fieldOptionType}
                />
              </InlineField>
              {(!option.type || option.type === FormElementType.STRING) && (
                <InlineField label="Value" labelWidth={8}>
                  <Input
                    placeholder="string"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      onChangeOption(
                        element,
                        {
                          ...option,
                          value: event.target.value,
                        },
                        option,
                        true
                      );
                    }}
                    value={option.value}
                    width={12}
                    data-testid={TestIds.formElementsEditor.fieldOptionValue}
                  />
                </InlineField>
              )}
              {option.type === FormElementType.NUMBER && (
                <InlineField label="Value" labelWidth={8}>
                  <Input
                    type="number"
                    placeholder="number"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      onChangeOption(
                        element,
                        {
                          ...option,
                          value: Number(event.target.value),
                          id: event.target.value,
                        },
                        option,
                        true
                      );
                    }}
                    value={option.value}
                    width={12}
                    data-testid={TestIds.formElementsEditor.fieldOptionNumberValue}
                  />
                </InlineField>
              )}
              <InlineField label="Label" labelWidth={8} grow>
                <Input
                  placeholder="label"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeOption(element, {
                      ...option,
                      label: event.target.value,
                    });
                  }}
                  value={option.label}
                  data-testid={TestIds.formElementsEditor.fieldOptionLabel}
                />
              </InlineField>
              <Button
                variant="secondary"
                onClick={() => {
                  onChange({
                    ...element,
                    options: element.options?.filter((o) => o.value !== option.value),
                  });
                }}
                icon="minus"
                data-testid={TestIds.formElementsEditor.buttonRemoveOption}
              />
            </InlineFieldRow>
          ))}

          <Button
            variant="secondary"
            onClick={() => {
              onChange({
                ...element,
                options: element.options
                  ? element.options.concat({ id: '', value: '', label: '' })
                  : [{ id: '', value: '', label: '' }],
              });
            }}
            icon="plus"
            data-testid={TestIds.formElementsEditor.buttonAddOption}
          >
            Add Option
          </Button>
        </div>
      )}

      <Field label="Show if returned value is true">
        <CodeEditor
          value={element.showIf || ''}
          language={CodeLanguage.JAVASCRIPT}
          height={`${CodeEditorHeight}px`}
          onBlur={(code) => {
            onChange({
              ...element,
              showIf: code,
            });
          }}
          monacoOptions={{ formatOnPaste: true, formatOnType: true }}
          showLineNumbers={true}
          aria-label={TestIds.formElementsEditor.fieldShowIf}
        />
      </Field>
    </>
  );
};
