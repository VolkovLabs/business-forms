import React, { useCallback, useMemo, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { useFormElements } from '../../hooks';
import { FormElement, LayoutSection } from '../../types';
import { GetElementUniqueId, Reorder } from '../../utils';
import { Collapse } from '../Collapse';
import { ElementEditor, NewElement } from './components';
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
   * Add Elements
   */
  const onElementAdd = useCallback(
    (newElement: FormElement) => {
      onChangeElements(elements.concat([newElement]));
    },
    [elements, onChangeElements]
  );

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
      <NewElement elements={elements} onSave={onElementAdd} />
    </div>
  );
};
