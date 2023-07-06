import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import {
  Alert,
  Button,
  CollapsableSection,
  InlineField,
  InlineFieldRow,
  Input,
  RadioButtonGroup,
  Select,
  useTheme2,
  Icon,
  IconButton,
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
import { useFormElements } from '../../hooks';
import { FormElement, LayoutSection } from '../../types';
import {
  FormatNumberValue,
  GetElementWithNewType,
  IsElementConflict,
  Reorder,
  ToNumberValue,
  GetElementUniqueId,
} from '../../utils';
import { Styles } from './styles';

/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggables
   */
  ...draggableStyle,
});

/**
 * Properties
 */
interface Props extends StandardEditorProps<FormElement[]> {}

/**
 * Form Elements Editor
 */
export const FormElementsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = Styles(theme);

  /**
   * States
   */
  const [newElement, setNewElement] = useState(FormElementDefault);
  const [addElementError, setAddElementError] = useState<string | null>(null);
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

  /**
   * Form Elements State
   */
  const {
    elements,
    isChanged,
    onSaveUpdates,
    onChangeElements,
    onChangeElement,
    onChangeElementOption,
    onElementRemove,
  } = useFormElements(onChange, value);

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
    const element = GetElementWithNewType(newElement, newElement.type);
    const updated = [...elements, { ...element, uid: GetElementUniqueId(element) }];
    onChangeElements(updated);

    /**
     * Reset input values
     */
    setNewElement(FormElementDefault);
  }, [newElement, elements, onChangeElements]);

  /**
   * Drag End
   */
  const onDragEnd = useCallback(
    (result: DropResult) => {
      /**
       * Dropped outside the list
       */
      if (!result.destination) {
        return;
      }

      onChangeElements(Reorder(elements, result.source.index, result.destination.index));
    },
    [elements, onChangeElements]
  );

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
   * Toggle collapse state for element
   */
  const onToggleElement = useCallback((uid: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  }, []);

  /**
   * Return
   */
  return (
    <div data-testid={TestIds.formElementsEditor.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="elements">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((element, index) => {
                const isOpen = collapseState[element.uid];
                return (
                  <Draggable key={element.uid} draggableId={element.uid} index={index}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        className={styles.item}
                      >
                        <div>
                          <div
                            className={styles.header}
                            data-testid={TestIds.formElementsEditor.sectionLabel(element.id, element.type)}
                            onClick={() => onToggleElement(element.uid)}
                          >
                            <IconButton
                              name={isOpen ? 'angle-down' : 'angle-right'}
                              tooltip={isOpen ? 'Collapse' : 'Expand'}
                              className={styles.collapseIcon}
                              aria-expanded={isOpen}
                              aria-controls={element.uid}
                            />
                            <span className={styles.title}>
                              {element.title} [{element.id}]
                            </span>
                            <div className={styles.headerControls}>
                              <IconButton
                                name="trash-alt"
                                variant="secondary"
                                size="sm"
                                className={styles.removeButton}
                                data-testid={TestIds.formElementsEditor.buttonRemoveElement}
                                onClick={() => onElementRemove(GetElementUniqueId(element))}
                              />
                              <Icon
                                title="Drag and drop to reorder"
                                name="draggabledots"
                                size="lg"
                                className={styles.dragIcon}
                                onClick={(event) => event.stopPropagation()}
                                {...provided.dragHandleProps}
                              />
                            </div>
                          </div>
                          <div>
                            {isOpen && (
                              <div
                                className={styles.content}
                                data-testid={TestIds.formElementsEditor.sectionContent(element.id, element.type)}
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
                                </InlineFieldRow>

                                <InlineFieldRow>
                                  <InlineField label="Type" grow labelWidth={8}>
                                    <Select
                                      options={FormElementTypeOptions}
                                      onChange={(event: SelectableValue) => {
                                        onChangeElement(GetElementWithNewType(element, event?.value), true);
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
                                      placeholder="auto"
                                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        onChangeElement({
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
                                        value={layoutSectionOptions.find(
                                          (section) => section.value === element.section
                                        )}
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
                                        value={CodeLanguageOptions.find(
                                          (language) => language.value === element.language
                                        )}
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
                                      <InlineFieldRow
                                        key={index}
                                        data-testid={TestIds.formElementsEditor.fieldOption(option.value)}
                                      >
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
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
