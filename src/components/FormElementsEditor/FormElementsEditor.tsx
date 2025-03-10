import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useMemo, useState } from 'react';

import { TEST_IDS } from '../../constants';
import { useFormLayout } from '../../hooks';
import { FormElement, LayoutSection, LocalFormElement, PanelOptions } from '../../types';
import { getElementUniqueId, reorder } from '../../utils';
import { ElementEditor } from '../ElementEditor';
import { NewElement } from '../NewElement';
import { getStyles } from './FormElementsEditor.styles';

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
type Props = StandardEditorProps<FormElement[], null, PanelOptions>;

/**
 * Form Elements Editor
 */
export const FormElementsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

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
  } = useFormLayout({
    replaceVariables: context.replaceVariables,
    onChangeElementsOption: onChange,
    value,
  });

  /**
   * Add Elements
   */
  const onElementAdd = useCallback(
    (newElement: LocalFormElement) => {
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

      onChangeElements(reorder(elements, result.source.index, result.destination.index));
    },
    [elements, onChangeElements]
  );

  /**
   * Layout Sections
   */
  const layoutSectionOptions: SelectableValue[] = useMemo(() => {
    return (
      context.options?.layout?.sections?.map((section: LayoutSection) => {
        return { value: section.id, label: section.id };
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
    <div data-testid={TEST_IDS.formElementsEditor.root}>
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
                          fill="solid"
                          headerTestId={TEST_IDS.formElementsEditor.sectionLabel(element.id, element.type)}
                          contentTestId={TEST_IDS.formElementsEditor.sectionContent(element.id, element.type)}
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
                                data-testid={TEST_IDS.formElementsEditor.buttonRemoveElement}
                                onClick={() => onElementRemove(getElementUniqueId(element))}
                                aria-label="Remove"
                              />
                              <div className={styles.dragHandle} {...provided.dragHandleProps}>
                                <Icon
                                  title="Drag and drop to reorder"
                                  name="draggabledots"
                                  size="lg"
                                  className={styles.dragIcon}
                                />
                              </div>
                            </>
                          }
                        >
                          <ElementEditor
                            element={element}
                            onChange={onChangeElement}
                            layoutSectionOptions={layoutSectionOptions}
                            onChangeOption={onChangeElementOption}
                            data={context.data}
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

      <div className={styles.buttonWrap}>
        {isChanged && (
          <Button onClick={onSaveUpdates} data-testid={TEST_IDS.formElementsEditor.buttonSaveChanges}>
            Save changes
          </Button>
        )}
      </div>

      <hr />
      <NewElement elements={elements} onSave={onElementAdd} replaceVariables={context.replaceVariables} />
    </div>
  );
};
