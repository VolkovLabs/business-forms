import { DataFrame, SelectableValue } from '@grafana/data';
import { Field, InlineField, InlineFieldRow, Input, RadioButtonGroup, Select, useStyles2 } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

import {
  CODE_LANGUAGE_OPTIONS,
  FORM_ELEMENT_TYPE_OPTIONS,
  FormElementType,
  LINK_TARGET_OPTIONS,
  OPTIONS_SOURCE_OPTIONS,
  OptionsSource,
  RequestMethod,
  STRING_ELEMENT_OPTIONS,
  TEST_IDS,
} from '../../constants';
import { CodeLanguage, LocalFormElement, QueryField } from '../../types';
import { formatNumberValue, getElementWithNewType, isFormElementType, toNumberValue } from '../../utils';
import { AutosizeCodeEditor } from '../AutosizeCodeEditor';
import { ElementDateEditor } from '../ElementDateEditor';
import { ElementOptionsEditor } from '../ElementOptionsEditor';
import { ElementQueryOptionsEditor } from '../ElementQueryOptionsEditor';
import { getStyles } from './ElementEditor.styles';

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
  ) => boolean;

  /**
   * Layout Section Options
   */
  layoutSectionOptions: SelectableValue[];

  /**
   * Initial Request Method
   */
  initialMethod?: RequestMethod;

  /**
   * Query Fields
   */
  queryFields: QueryField[];

  /**
   * Is Query Fields Enabled
   */
  isQueryFieldsEnabled: boolean;

  /**
   * Data
   */
  data: DataFrame[];
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
  isQueryFieldsEnabled,
  queryFields,
  data,
}) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

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
            data-testid={TEST_IDS.formElementsEditor.fieldId}
          />
        </InlineField>

        {element.type === FormElementType.STRING && (
          <InlineField data-testid={TEST_IDS.formElementsEditor.fieldVisibility}>
            <RadioButtonGroup
              options={STRING_ELEMENT_OPTIONS}
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
            options={FORM_ELEMENT_TYPE_OPTIONS}
            onChange={(event: SelectableValue) => {
              onChange(getElementWithNewType(element, event?.value), true);
            }}
            value={FORM_ELEMENT_TYPE_OPTIONS.find((type) => type.value === element.type)}
            aria-label={TEST_IDS.formElementsEditor.fieldType}
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
                width: toNumberValue(event.target.value),
              });
            }}
            value={formatNumberValue(element.width)}
            min={0}
            type="number"
            data-testid={TEST_IDS.formElementsEditor.fieldWidth}
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
            data-testid={TEST_IDS.formElementsEditor.fieldLabel}
          />
        </InlineField>

        <InlineField label="Label Width" labelWidth={12}>
          <Input
            placeholder="auto"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({
                ...element,
                labelWidth: toNumberValue(event.target.value),
              });
            }}
            value={formatNumberValue(element.labelWidth)}
            type="number"
            data-testid={TEST_IDS.formElementsEditor.fieldLabelWidth}
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
            data-testid={TEST_IDS.formElementsEditor.fieldTooltip}
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
            data-testid={TEST_IDS.formElementsEditor.fieldUnit}
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
              aria-label={TEST_IDS.formElementsEditor.fieldSection}
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
              data-testid={TEST_IDS.formElementsEditor.fieldSliderMin}
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
              data-testid={TEST_IDS.formElementsEditor.fieldSliderMax}
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
              data-testid={TEST_IDS.formElementsEditor.fieldSliderStep}
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
                  min: event.target.value ? Number(event.target.value) : undefined,
                });
              }}
              type="number"
              width={10}
              value={formatNumberValue(element.min)}
              data-testid={TEST_IDS.formElementsEditor.fieldNumberMin}
            />
          </InlineField>
          <InlineField label="Max" labelWidth={8}>
            <Input
              placeholder="Max"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  max: event.target.value ? Number(event.target.value) : undefined,
                });
              }}
              type="number"
              width={10}
              value={formatNumberValue(element.max)}
              data-testid={TEST_IDS.formElementsEditor.fieldNumberMax}
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
            data-testid={TEST_IDS.formElementsEditor.fieldMinDate}
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
            data-testid={TEST_IDS.formElementsEditor.fieldMaxDate}
          />
        </>
      )}

      {(element.type === FormElementType.TEXTAREA || element.type === FormElementType.DISABLED_TEXTAREA) && (
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
              data-testid={TEST_IDS.formElementsEditor.fieldTextareaRows}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.CODE && (
        <InlineFieldRow>
          <InlineField label="Language" grow labelWidth={10}>
            <Select
              options={CODE_LANGUAGE_OPTIONS}
              onChange={(event: SelectableValue) => {
                onChange({
                  ...element,
                  language: event?.value,
                });
              }}
              value={CODE_LANGUAGE_OPTIONS.find((language) => language.value === element.language)}
              aria-label={TEST_IDS.formElementsEditor.fieldCodeLanguage}
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
              data-testid={TEST_IDS.formElementsEditor.fieldCodeHeight}
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
              data-testid={TEST_IDS.formElementsEditor.fieldNamePicker}
            />
          </InlineField>
        </InlineFieldRow>
      )}
      {isQueryFieldsEnabled && (
        <InlineFieldRow>
          <InlineField grow={true} label="Query Field" labelWidth={14} tooltip="Specify a field name from the Query">
            <Select
              value={element.queryField?.value}
              options={queryFields}
              onChange={(item) => {
                onChange({
                  ...element,
                  queryField: item,
                });
              }}
              aria-label={TEST_IDS.formElementsEditor.fieldFromQueryPicker}
              isClearable={true}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {element.type === FormElementType.FILE && (
        <InlineFieldRow>
          <InlineField
            grow={true}
            label="Accept"
            labelWidth={14}
            tooltip="Specify comma-separated file extensions or keep blank to allow any file"
          >
            <Input
              value={element.accept || ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({
                  ...element,
                  accept: event.target.value,
                });
              }}
              data-testid={TEST_IDS.formElementsEditor.fieldAccept}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {isFormElementType(element, FormElementType.LINK) && (
        <InlineFieldRow>
          <InlineField grow={true} label="Link Text" labelWidth={14}>
            <Input
              value={element.linkText}
              onChange={(event) => {
                onChange({
                  ...element,
                  linkText: event.currentTarget.value,
                });
              }}
              placeholder="Link address will be used"
              data-testid={TEST_IDS.formElementsEditor.fieldLinkText}
            />
          </InlineField>
          <InlineField grow={true} label="Open in" labelWidth={14}>
            <RadioButtonGroup
              value={element.target}
              onChange={(value) => {
                onChange({
                  ...element,
                  target: value,
                });
              }}
              options={LINK_TARGET_OPTIONS}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {(element.type === FormElementType.RADIO ||
        element.type === FormElementType.SELECT ||
        element.type === FormElementType.MULTISELECT ||
        element.type === FormElementType.DISABLED) && (
        <>
          <InlineFieldRow>
            <InlineField label="Options Source" labelWidth={14}>
              <RadioButtonGroup
                options={OPTIONS_SOURCE_OPTIONS}
                value={element.optionsSource || OptionsSource.CUSTOM}
                onChange={(value) => {
                  onChange({
                    ...element,
                    optionsSource: value,
                  });
                }}
              />
            </InlineField>
          </InlineFieldRow>
          {element.optionsSource === OptionsSource.QUERY && (
            <ElementQueryOptionsEditor
              value={element.queryOptions}
              onChange={(queryOptions) => {
                onChange({
                  ...element,
                  queryOptions,
                });
              }}
              data={data}
            />
          )}
          {element.optionsSource === OptionsSource.CODE && (
            <Field label="Get Options Code" description="Must return array with {label,value} objects">
              <AutosizeCodeEditor
                value={element.getOptions || ''}
                language={CodeLanguage.JAVASCRIPT}
                onBlur={(code) => {
                  onChange({
                    ...element,
                    getOptions: code,
                  });
                }}
                monacoOptions={{ formatOnPaste: true, formatOnType: true }}
                showLineNumbers={true}
                aria-label={TEST_IDS.formElementsEditor.fieldGetOptions}
              />
            </Field>
          )}
          {element.optionsSource === OptionsSource.CUSTOM ||
            (!element.optionsSource && (
              <div className={styles.optionsContainer} data-testid={TEST_IDS.formElementsEditor.options}>
                <ElementOptionsEditor
                  options={element.options}
                  onChange={(options) =>
                    onChange({
                      ...element,
                      options,
                    })
                  }
                  onChangeItem={(updated, original, checkConflict) => {
                    return onChangeOption(element, updated, original, checkConflict);
                  }}
                />
              </div>
            ))}
        </>
      )}

      <Field label="Show if returned value is true">
        <AutosizeCodeEditor
          value={element.showIf || ''}
          language={CodeLanguage.JAVASCRIPT}
          onBlur={(code) => {
            onChange({
              ...element,
              showIf: code,
            });
          }}
          monacoOptions={{ formatOnPaste: true, formatOnType: true }}
          showLineNumbers={true}
          aria-label={TEST_IDS.formElementsEditor.fieldShowIf}
        />
      </Field>
    </>
  );
};
