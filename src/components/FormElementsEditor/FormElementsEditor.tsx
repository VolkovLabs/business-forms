import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Button, Icon, IconButton, useTheme2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { ElementsEditorList } from 'components/ElementsEditorList';
import React, { useCallback, useMemo, useState } from 'react';

import { FormElementType, RequestMethod, TEST_IDS } from '../../constants';
import { useFormElements, useQueryFields } from '../../hooks';
import { FormElement, LayoutSection, LocalFormElement, PanelOptions } from '../../types';
import { reorder } from '../../utils';
import { NewElement } from '../NewElement';

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
  } = useFormElements({
    onChange,
    value,
  });

  /**
   * Query Fields
   */
  const isQueryFieldsEnabled = context.options?.initial?.method === RequestMethod.QUERY;
  const queryFields = useQueryFields({ data: context.data, isEnabled: isQueryFieldsEnabled });

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
      console.log('console >>>>> onDragEnd result >>>', result);
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
   * Return
   */
  return (
    <div data-testid={TEST_IDS.formElementsEditor.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* <Droppable isCombineEnabled droppableId="elements" type="elements">
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
                          fill={element.type === FormElementType.GROUP ? 'outline' : 'solid'}
                          headerTestId={TEST_IDS.formElementsEditor.sectionLabel(element.id, element.type)}
                          contentTestId={TEST_IDS.formElementsEditor.sectionContent(element.id, element.type)}
                          isOpen={isOpen}
                          onToggle={() => onToggleElement(element.uid)}
                          title={
                            <>
                              {element.type === FormElementType.GROUP && (
                                <Icon title="Group" name="gf-layout-simple" size="lg" className={styles.dragIcon} />
                              )}
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
                          {element.type === FormElementType.GROUP ? (
                            <GroupElementsEditor
                              element={element}
                              onChange={onChangeElement}
                              layoutSectionOptions={layoutSectionOptions}
                              initialMethod={context.options?.initial?.method}
                              onChangeOption={onChangeElementOption}
                              queryFields={queryFields}
                              isQueryFieldsEnabled={isQueryFieldsEnabled}
                              data={context.data}
                            />
                          ) : (
                            <ElementEditor
                              element={element}
                              onChange={onChangeElement}
                              layoutSectionOptions={layoutSectionOptions}
                              initialMethod={context.options?.initial?.method}
                              onChangeOption={onChangeElementOption}
                              queryFields={queryFields}
                              isQueryFieldsEnabled={isQueryFieldsEnabled}
                              data={context.data}
                            />
                          )}
                        </Collapse>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable> */}
        <ElementsEditorList
          elements={elements}
          typeId="droppable"
          onChangeElement={onChangeElement}
          layoutSectionOptions={layoutSectionOptions}
          context={context}
          onChangeElementOption={onChangeElementOption}
          queryFields={queryFields}
          isQueryFieldsEnabled={isQueryFieldsEnabled}
          onElementRemove={onElementRemove}
        />
      </DragDropContext>

      {isChanged && (
        <Button onClick={onSaveUpdates} data-testid={TEST_IDS.formElementsEditor.buttonSaveChanges}>
          Save changes
        </Button>
      )}

      <hr />
      <NewElement elements={elements} onSave={onElementAdd} />
    </div>
  );
};
