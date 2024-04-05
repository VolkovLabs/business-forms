import { GrafanaTheme2, StandardEditorContext } from '@grafana/data';
import { Icon, IconButton, useTheme2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import { ElementEditor } from 'components/ElementEditor';
import React, { useCallback, useState } from 'react';
import { FormElement } from 'types';

import { FormElementType, TEST_IDS } from '../../constants';
import { getElementUniqueId } from '../../utils';
import { getStyles } from './ElementsEditorList.style';
/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggables
   */
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean, theme: GrafanaTheme2) => ({
  background: isDraggingOver ? theme.colors.info.transparent : theme.colors.background.primary,
  padding: theme.spacing(1),
});

/**
 * Properties
 */
type Props = {
  elements: FormElement[];
  typeId: string;
  onChangeElement;
  layoutSectionOptions;
  context;
  onChangeElementOption;
  queryFields;
  isQueryFieldsEnabled;
  onElementRemove;
};

export const ElementsEditorList: React.FC<Props> = ({
  elements,
  typeId,
  onChangeElement,
  layoutSectionOptions,
  context,
  onChangeElementOption,
  queryFields,
  isQueryFieldsEnabled,
  onElementRemove,
}) => {
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
   * Toggle collapse state for element
   */
  const onToggleElement = useCallback((uid: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  }, []);

  return (
    <Droppable isCombineEnabled droppableId={typeId} type={`elements`}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, theme)}>
          {elements.map((element, index) => {
            const isOpen = collapseState[element.uid];
            return (
              <Draggable key={element.uid} draggableId={element.uid} index={index}>
                {(provided, snapshot) => (
                  <div>
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
                              <Icon title="Group" name="gf-layout-simple" size="lg" className={styles.groupIcon} />
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
                          <ElementsEditorList
                            elements={element.value}
                            typeId={element.uid}
                            onChangeElement={onChangeElement}
                            layoutSectionOptions={layoutSectionOptions}
                            context={context}
                            onChangeElementOption={onChangeElementOption}
                            queryFields={queryFields}
                            isQueryFieldsEnabled={isQueryFieldsEnabled}
                            onElementRemove={onElementRemove}
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
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ElementsEditorList;
