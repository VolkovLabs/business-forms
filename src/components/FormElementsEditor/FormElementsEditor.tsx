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
  Icon,
  IconButton,
  InlineField,
  Input,
  Select,
  useTheme2,
} from '@grafana/ui';
import { FormElementDefault, FormElementTypeOptions, TestIds } from '../../constants';
import { useFormElements } from '../../hooks';
import { FormElement, LayoutSection } from '../../types';
import { GetElementUniqueId, GetElementWithNewType, IsElementConflict, Reorder } from '../../utils';
import { Collapse } from '../Collapse';
import { ElementEditor } from './components';
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
                        <Collapse
                          headerTestId={TestIds.formElementsEditor.sectionLabel(element.id, element.type)}
                          contentTestId={TestIds.formElementsEditor.sectionContent(element.id, element.type)}
                          isOpen={isOpen}
                          onToggle={() => onToggleElement(element.uid)}
                          title={
                            <>
                              {element.title} [{element.id}]
                            </>
                          }
                          actions={
                            <>
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
                            </>
                          }
                        >
                          <ElementEditor
                            element={element}
                            onChange={onChangeElement}
                            layoutSectionOptions={layoutSectionOptions}
                            onChangeOption={onChangeElementOption}
                          />
                        </Collapse>
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
