import React, { ChangeEvent, useState } from 'react';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import {
  Button,
  ButtonGroup,
  CollapsableSection,
  IconButton,
  InlineField,
  InlineFieldRow,
  Input,
  Select,
} from '@grafana/ui';
import {
  CodeEditorHeight,
  CodeLanguage,
  CodeLanguageOptions,
  FormElementDefault,
  FormElementType,
  FormElementTypeOptions,
  SelectElementOptions,
  SliderDefault,
} from '../../constants';
import { FormElement, LayoutSection } from '../../types';
import { MoveFormElements } from '../../utils';

/**
 * Properties
 */
interface Props extends StandardEditorProps<FormElement[]> {}

/**
 * Form Elements Editor
 */
export const FormElementsEditor: React.FC<Props> = ({ value: elements, onChange, context }) => {
  /**
   * States
   */
  const [newElement, setNewElement] = useState(FormElementDefault);

  if (!elements || !elements.length) {
    elements = [];
  }

  /**
   * Remove Element
   */
  const onElementRemove = (id: string) => {
    const updated = elements.filter((e) => e.id !== id);

    /**
     * Update Elements
     */
    onChange(updated);
  };

  /**
   * Add Elements
   */
  const onElementAdd = () => {
    /**
     * Slider values
     */
    if (newElement.type === FormElementType.SLIDER) {
      newElement.min = SliderDefault.min;
      newElement.max = SliderDefault.max;
      newElement.step = SliderDefault.step;
      newElement.value = SliderDefault.value;
    }

    /**
     * Update Elements
     */
    const updated = [...elements, newElement];
    onChange(updated);

    /**
     * Reset input values
     */
    setNewElement(FormElementDefault);
  };

  /**
   * Layout Sections
   */
  const layoutSectionOptions: SelectableValue[] = [];
  if (context.options?.layout && context.options.layout.sections?.length) {
    context.options.layout.sections.forEach((section: LayoutSection) => {
      layoutSectionOptions.push({ value: section.name, label: section.name });
    });
  }

  /**
   * Return
   */
  return (
    <div>
      {elements.map((element, id) => (
        <CollapsableSection
          key={id}
          label={
            <ButtonGroup>
              {id > 0 && (
                <IconButton
                  name="arrow-up"
                  tooltip="Move Up"
                  onClick={(event) => {
                    MoveFormElements(elements, id, id - 1);
                    onChange(elements);
                    event.stopPropagation();
                  }}
                />
              )}
              {id < elements.length - 1 && (
                <IconButton
                  name="arrow-down"
                  tooltip="Move Down"
                  onClick={(event) => {
                    MoveFormElements(elements, id, id + 1);
                    onChange(elements);
                    event.stopPropagation();
                  }}
                />
              )}
              {element.title} [{element.id}]
            </ButtonGroup>
          }
          isOpen={false}
        >
          <InlineFieldRow>
            <InlineField label="Id" grow labelWidth={8} invalid={element.id === ''}>
              <Input
                placeholder="Id"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  element.id = event.target.value;
                  onChange(elements);
                }}
                value={element.id}
              />
            </InlineField>

            <Button variant="destructive" onClick={(e) => onElementRemove(element.id)} icon="trash-alt"></Button>
          </InlineFieldRow>

          <InlineFieldRow>
            <InlineField label="Type" grow labelWidth={8}>
              <Select
                options={FormElementTypeOptions}
                onChange={(event: SelectableValue) => {
                  element.type = event?.value;

                  /**
                   * Slider values
                   */
                  if (element.type === FormElementType.SLIDER) {
                    element.min = SliderDefault.min;
                    element.max = SliderDefault.max;
                    element.step = SliderDefault.step;
                    element.value = SliderDefault.value;
                  }

                  onChange(elements);
                }}
                value={FormElementTypeOptions.find((type) => type.value === element.type)}
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
                  element.width = Number(event.target.value);
                  onChange(elements);
                }}
                value={element.width}
                defaultValue={FormElementDefault.width}
                min={0}
                type="number"
              />
            </InlineField>
          </InlineFieldRow>
          <InlineFieldRow>
            <InlineField label="Label" grow labelWidth={8} invalid={element.title === ''}>
              <Input
                placeholder="Label"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  element.title = event.target.value;
                  onChange(elements);
                }}
                value={element.title}
              />
            </InlineField>

            <InlineField label="Label Width" labelWidth={12}>
              <Input
                placeholder="10"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  element.labelWidth = Number(event.target.value);
                  onChange(elements);
                }}
                value={element.labelWidth}
                defaultValue={FormElementDefault.labelWidth}
                type="number"
              />
            </InlineField>
          </InlineFieldRow>

          <InlineFieldRow>
            <InlineField label="Tooltip" grow labelWidth={8}>
              <Input
                placeholder="Tooltip"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  element.tooltip = event.target.value;
                  onChange(elements);
                }}
                value={element.tooltip}
              />
            </InlineField>

            <InlineField label="Unit" labelWidth={12}>
              <Input
                placeholder="Unit"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  element.unit = event.target.value;
                  onChange(elements);
                }}
                value={element.unit}
              />
            </InlineField>
          </InlineFieldRow>

          {layoutSectionOptions.length > 0 && (
            <InlineFieldRow>
              <InlineField label="Section" grow labelWidth={8}>
                <Select
                  options={layoutSectionOptions}
                  onChange={(event: SelectableValue) => {
                    element.section = event?.value;
                    onChange(elements);
                  }}
                  value={layoutSectionOptions.find((section) => section.value === element.section)}
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
                    element.min = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.min}
                />
              </InlineField>
              <InlineField label="Max" labelWidth={8}>
                <Input
                  placeholder="Max"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.max = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.max}
                />
              </InlineField>
              <InlineField label="Step" labelWidth={8}>
                <Input
                  placeholder="Step"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.step = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.step}
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
                    element.min = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.min}
                />
              </InlineField>
              <InlineField label="Max" labelWidth={8}>
                <Input
                  placeholder="Max"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.max = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.max}
                />
              </InlineField>
            </InlineFieldRow>
          )}

          {element.type === FormElementType.TEXTAREA && (
            <InlineFieldRow>
              <InlineField label="Rows" labelWidth={8}>
                <Input
                  placeholder="Rows"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.rows = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  width={10}
                  value={element.rows}
                  min={2}
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
                    element.language = event?.value;
                    onChange(elements);
                  }}
                  value={CodeLanguageOptions.find((language) => language.value === element.language)}
                  defaultValue={CodeLanguage.JAVASCRIPT}
                />
              </InlineField>
              <InlineField label="Height" labelWidth={12} tooltip="Code Editor height in px">
                <Input
                  placeholder="Height"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    element.height = Number(event.target.value);
                    onChange(elements);
                  }}
                  type="number"
                  value={element.height}
                  defaultValue={CodeEditorHeight}
                  min={0}
                />
              </InlineField>
            </InlineFieldRow>
          )}

          {[FormElementType.RADIO, FormElementType.SELECT, FormElementType.DISABLED].includes(element.type) && (
            <div>
              {element.options?.map((option) => (
                <InlineFieldRow key={option.id}>
                  <InlineField label="Type" labelWidth={8}>
                    <Select
                      options={SelectElementOptions}
                      onChange={(event: SelectableValue) => {
                        option.type = event?.value;
                        onChange(elements);
                      }}
                      width={12}
                      value={SelectElementOptions.find((type) => type.value === option.type)}
                      defaultValue={FormElementType.STRING}
                    />
                  </InlineField>
                  {(!option.type || option.type === FormElementType.STRING) && (
                    <InlineField label="Value" labelWidth={8}>
                      <Input
                        placeholder="string"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          option.value = event.target.value;
                          onChange(elements);
                        }}
                        value={option.value}
                        width={12}
                      />
                    </InlineField>
                  )}
                  {option.type === FormElementType.NUMBER && (
                    <InlineField label="Value" labelWidth={8}>
                      <Input
                        type="number"
                        placeholder="number"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          option.value = Number(event.target.value);
                          onChange(elements);
                        }}
                        value={option.value}
                        width={12}
                      />
                    </InlineField>
                  )}
                  <InlineField label="Label" labelWidth={8} grow>
                    <Input
                      placeholder="label"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        option.label = event.target.value;
                        onChange(elements);
                      }}
                      value={option.label}
                    />
                  </InlineField>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      element.options = element.options?.filter((o) => o.value !== option.value);
                      onChange(elements);
                    }}
                    icon="minus"
                  ></Button>
                </InlineFieldRow>
              ))}

              <Button
                variant="secondary"
                onClick={(e) => {
                  if (element.options) {
                    element.options.push({ value: '', label: '' });
                  } else {
                    element.options = [{ value: '', label: '' }];
                  }

                  onChange(elements);
                }}
                icon="plus"
              >
                Add Option
              </Button>
            </div>
          )}
        </CollapsableSection>
      ))}

      <hr />
      <CollapsableSection label="New Element" isOpen={true}>
        <InlineField label="Id" grow labelWidth={8} invalid={newElement.id === ''}>
          <Input
            placeholder="Id"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewElement({ ...newElement, id: event.target.value });
            }}
            value={newElement.id}
          />
        </InlineField>

        <InlineField label="Label" grow labelWidth={8} invalid={newElement.title === ''}>
          <Input
            placeholder="Label"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewElement({ ...newElement, title: event.target.value });
            }}
            value={newElement.title}
          />
        </InlineField>

        <InlineField label="Type" grow labelWidth={8}>
          <Select
            options={FormElementTypeOptions}
            onChange={(event?: SelectableValue) => {
              setNewElement({ ...newElement, type: event?.value });
            }}
            value={FormElementTypeOptions.find((type) => type.value === newElement.type)}
          />
        </InlineField>

        <Button
          variant="secondary"
          onClick={(e) => onElementAdd()}
          disabled={!!!newElement.id || !!!newElement.type}
          icon="plus"
        >
          Add Element
        </Button>
      </CollapsableSection>
    </div>
  );
};
