import { SelectableValue } from '@grafana/data';
import { Button, Icon, IconButton, Label, useStyles2 } from '@grafana/ui';
import { DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle } from '@hello-pangea/dnd';
import { Collapse } from '@volkovlabs/components';
import React, { useCallback, useState } from 'react';

import { FORM_ELEMENT_OPTION_DEFAULT, TEST_IDS } from '@/constants';
import { reorder } from '@/utils';

import { ElementOptionEditor } from './components/ElementOptionEditor';
import { getStyles } from './ElementOptionsEditor.styles';

/**
 * Get Item Style
 */
const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  /**
   * styles we need to apply on draggable
   */
  ...draggableStyle,
});

/**
 * Properties
 */
interface Props {
  /**
   * Options
   */
  options?: SelectableValue[];

  /**
   * On Change
   */
  onChange: (options: SelectableValue[]) => void;

  /**
   * On Change Item
   */
  onChangeItem: (updated: SelectableValue, original?: SelectableValue, checkConflict?: boolean) => boolean;

  /**
   * Icon Enabled
   *
   * @type {boolean}
   */
  iconEnabled?: boolean;
}

/**
 * Element Options Editor
 */
export const ElementOptionsEditor: React.FC<Props> = ({ options = [], onChange, onChangeItem, iconEnabled = true }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * States
   */
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});

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

      onChange(reorder(options, result.source.index, result.destination.index));
    },
    [options, onChange]
  );

  /**
   * Toggle collapse state for option
   */
  const onToggleVisibility = useCallback((id: string) => {
    setCollapseState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  /**
   * Return
   */
  return (
    <>
      <Label>Options</Label>
      <div className={styles.content}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {options.map((option, index) => {
                  const isOpen = !collapseState[option.id];
                  return (
                    <Draggable key={option.id} draggableId={option.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          className={styles.item}
                        >
                          <Collapse
                            fill="solid"
                            headerTestId={TEST_IDS.formElementsEditor.optionLabel(option.id)}
                            contentTestId={TEST_IDS.formElementsEditor.optionContent(option.id)}
                            isOpen={isOpen}
                            onToggle={() => onToggleVisibility(option.id)}
                            title={
                              <>
                                {option.label} [{option.id}]
                              </>
                            }
                            actions={
                              <>
                                <IconButton
                                  name="trash-alt"
                                  variant="secondary"
                                  size="sm"
                                  className={styles.removeButton}
                                  data-testid={TEST_IDS.formElementsEditor.buttonRemoveOption}
                                  onClick={() => onChange(options?.filter((o) => o.id !== option.id))}
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
                            <ElementOptionEditor
                              key={option.id}
                              option={option}
                              onChangeItem={onChangeItem}
                              iconEnabled={iconEnabled}
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

        <Button
          variant="secondary"
          onClick={() => {
            const newOption = {
              ...FORM_ELEMENT_OPTION_DEFAULT,
              type: !!options.length ? options[0].type : FORM_ELEMENT_OPTION_DEFAULT.type,
            };

            onChange(options.concat(newOption));
          }}
          icon="plus"
          data-testid={TEST_IDS.formElementsEditor.buttonAddOption}
          size="sm"
          disabled={options.some((option) => option.id === FORM_ELEMENT_OPTION_DEFAULT.id)}
        >
          Add Option
        </Button>
      </div>
    </>
  );
};
