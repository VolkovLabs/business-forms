import React, { ChangeEvent, useCallback, useMemo, useState, useEffect } from 'react';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import {
  Alert,
  Button,
  ButtonGroup,
  CollapsableSection,
  IconButton,
  InlineField,
  InlineFieldRow,
  Input,
  RadioButtonGroup,
  Select,
} from '@grafana/ui';
import {
  CodeLanguageOptions,
  FormElementDefault,
  FormElementType,
  FormElementTypeOptions,
  SelectElementOptions,
  StringElementOptions,
  TestIds,
} from '../../constants';
import { FormElement, LayoutSection } from '../../types';
import {
  MoveFormElements,
  GetElementWithNewType,
  IsElementConflict,
  IsElementOptionConflict,
  FormatNumberValue,
  ToNumberValue,
} from '../../utils';
import { useAutoSave } from './useAutoSave';

/**
 * Properties
 */
interface Props extends StandardEditorProps<FormElement[]> {}

/**
 * Form Elements Editor
 */
export const FormElementsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * States
   */
  const [newElement, setNewElement] = useState(FormElementDefault);
  const [elements, setElements] = useState(value && Array.isArray(value) ? value : []);
  const [isChanged, setIsChanged] = useState(false);
  const [addElementError, setAddElementError] = useState<string | null>(null);
  const { startTimer, removeTimer } = useAutoSave();

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(elements);
    setIsChanged(false);
  }, [elements, onChange]);

  /**
   * Change Elements
   */
  const onChangeElements = useCallback((newElements: FormElement[]) => {
    setElements(newElements);
    setIsChanged(true);
  }, []);

  /**
   * Change Element
   */
  const onChangeElement = useCallback(
    (
      updatedElement: FormElement,
      { id = updatedElement.id, type = updatedElement.type }: FormElement = updatedElement,
      checkConflict = false
    ) => {
      if (checkConflict && IsElementConflict(elements, updatedElement)) {
        alert('Element with the same id and type exists.');
        return;
      }

      onChangeElements(
        elements.map((element) => (element.id === id && element.type === type ? updatedElement : element))
      );
    },
    [elements, onChangeElements]
  );

  /**
   * Change Element Option
   */
  const onChangeElementOption = useCallback(
    (
      element: FormElement,
      updatedOption: SelectableValue,
      { value = updatedOption.value }: SelectableValue = {},
      checkConflict = false
    ) => {
      if ('options' in element) {
        if (checkConflict && IsElementOptionConflict(element.options || [], updatedOption)) {
          alert('Option with the same value exists');
          return;
        }

        onChangeElement({
          ...element,
          options: element.options?.map((item) => (item.value === value ? updatedOption : item)),
        });
      }
    },
    [onChangeElement]
  );

  /**
   * Remove Element
   */
  const onElementRemove = (id: string) => {
    const updated = elements.filter((e) => e.id !== id);

    /**
     * Update Elements
     */
    onChangeElements(updated);
  };

  /**
   * Change new element
   */
  const onChangeNewElement = useCallback((newElement: FormElement) => {
    setNewElement(newElement);
    setAddElementError(null);
  }, []);

  /**
   * Add Elements
   */
  const onElementAdd = useCallback(() => {
    if (IsElementConflict(elements, newElement)) {
      setAddElementError('Element with the same Id and Type already exists');
      return;
    }
    /**
     * Update Elements
     */
    const updated = [...elements, GetElementWithNewType(newElement, newElement.type)];
    onChangeElements(updated);

    /**
     * Reset input values
     */
    setNewElement(FormElementDefault);
  }, [newElement, elements, onChangeElements]);

  /**
   * Layout Sections
   */
  const layoutSectionOptions: SelectableValue[] = useMemo(() => {
    return (
      context.options?.layout?.sections?.map((section: LayoutSection) => {
        return { value: section.name, label: section.name };
      }) || []
    );
  }, [context.options?.layout?.sections]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }
    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer]);

  /**
   * Update local elements
   */
  useEffect(() => {
    setElements(value && Array.isArray(value) ? value : []);
    setIsChanged(false);
  }, [value]);

  /**
   * Return
   */
  return (
    <div data-testid={TestIds.formElementsEditor.root}>
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
                    onChangeElements(MoveFormElements(elements, id, id - 1));
                    event.stopPropagation();
                  }}
                  data-testid={TestIds.formElementsEditor.buttonMoveElementUp(element.id, element.type)}
                />
              )}
              {id < elements.length - 1 && (
                <IconButton
                  name="arrow-down"
                  tooltip="Move Down"
                  onClick={(event) => {
                    onChangeElements(MoveFormElements(elements, id, id + 1));
                    event.stopPropagation();
                  }}
                  data-testid={TestIds.formElementsEditor.buttonMoveElementDown(element.id, element.type)}
                />
              )}
              {element.title} [{element.id}]
            </ButtonGroup>
          }
          isOpen={false}
          headerDataTestId={TestIds.formElementsEditor.sectionLabel(element.id, element.type)}
          contentDataTestId={TestIds.formElementsEditor.sectionContent(element.id, element.type)}
        >
          <InlineFieldRow>
            <InlineField label="Id" grow labelWidth={8} invalid={element.id === ''}>
              <Input
                placeholder="Id"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChangeElement(
                    {
                      ...element,
                      id: event.target.value,
                    },
                    element,
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
                    onChangeElement({
                      ...element,
                      hidden: value,
                    });
                  }}
                />
              </InlineField>
            )}

            <InlineField>
              <Button
                data-testid={TestIds.formElementsEditor.buttonRemoveElement}
                variant="destructive"
                onClick={() => onElementRemove(element.id)}
                icon="trash-alt"
              />
            </InlineField>
          </InlineFieldRow>

          <InlineFieldRow>
            <InlineField label="Type" grow labelWidth={8}>
              <Select
                options={FormElementTypeOptions}
                onChange={(event: SelectableValue) => {
                  onChangeElement(GetElementWithNewType(element, event?.value), element, true);
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
                  onChangeElement({
                    ...element,
                    width: Number(event.target.value),
                  });
                }}
                value={element.width}
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
                  onChangeElement({
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
                placeholder="10"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChangeElement({
                    ...element,
                    labelWidth: Number(event.target.value),
                  });
                }}
                value={element.labelWidth}
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
                  onChangeElement({
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
                  onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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

          {element.type === FormElementType.TEXTAREA && (
            <InlineFieldRow>
              <InlineField label="Rows" labelWidth={8}>
                <Input
                  placeholder="Rows"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement({
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
                    onChangeElement({
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
                    onChangeElement({
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

          {(element.type === FormElementType.RADIO ||
            element.type === FormElementType.SELECT ||
            element.type === FormElementType.DISABLED) && (
            <div>
              {element.options?.map((option, index) => (
                <InlineFieldRow key={index} data-testid={TestIds.formElementsEditor.fieldOption(option.value)}>
                  <InlineField label="Type" labelWidth={8}>
                    <Select
                      options={SelectElementOptions}
                      onChange={(event: SelectableValue) => {
                        onChangeElementOption(element, {
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
                          onChangeElementOption(
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
                          onChangeElementOption(
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
                        onChangeElementOption(element, {
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
                      onChangeElement({
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
                  onChangeElement({
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
        </CollapsableSection>
      ))}

      {isChanged && (
        <Button onClick={onSaveUpdates} data-testid={TestIds.formElementsEditor.buttonSaveChanges}>
          Save changes
        </Button>
      )}

      <hr />
      <CollapsableSection
        label="New Element"
        isOpen={true}
        headerDataTestId={TestIds.formElementsEditor.sectionNewLabel}
        contentDataTestId={TestIds.formElementsEditor.sectionNewContent}
      >
        <InlineField label="Id" grow labelWidth={8} invalid={newElement.id === ''}>
          <Input
            placeholder="Id"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChangeNewElement({ ...newElement, id: event.target.value });
            }}
            value={newElement.id}
            data-testid={TestIds.formElementsEditor.newElementId}
          />
        </InlineField>

        <InlineField label="Label" grow labelWidth={8} invalid={newElement.title === ''}>
          <Input
            placeholder="Label"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChangeNewElement({ ...newElement, title: event.target.value });
            }}
            value={newElement.title}
            data-testid={TestIds.formElementsEditor.newElementLabel}
          />
        </InlineField>

        <InlineField label="Type" grow labelWidth={8}>
          <Select
            aria-label={TestIds.formElementsEditor.newElementType}
            options={FormElementTypeOptions}
            onChange={(event?: SelectableValue) => {
              onChangeNewElement({ ...newElement, type: event?.value });
            }}
            value={FormElementTypeOptions.find((type) => type.value === newElement.type)}
          />
        </InlineField>

        {!!addElementError && (
          <Alert data-testid={TestIds.formElementsEditor.addElementError} severity="error" title="Element Creation">
            {addElementError}
          </Alert>
        )}

        <Button
          variant="secondary"
          onClick={onElementAdd}
          disabled={!newElement.id || !newElement.type || !!addElementError}
          icon="plus"
          data-testid={TestIds.formElementsEditor.buttonAddElement}
        >
          Add Element
        </Button>
      </CollapsableSection>
    </div>
  );
};
