import React, { ChangeEvent, useCallback, useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { Button, Icon, IconButton, InlineField, InlineFieldRow, Input, Label, Select, useStyles2 } from '@grafana/ui';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { FormElementType, IconOptions, SelectElementOptions, TestIds } from '../../constants';
import { Styles } from './ElementOptionsEditor.styles';
import { Collapse } from '../Collapse';
import { Reorder } from '../../utils';

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
}

/**
 * Element Options Editor
 */
export const ElementOptionsEditor: React.FC<Props> = ({ options = [], onChange, onChangeItem }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

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

      onChange(Reorder(options, result.source.index, result.destination.index));
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
          <Droppable droppableId="elements">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {options.map((option, index) => {
                  const isOpen = collapseState[option.id];
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
                            headerTestId={TestIds.formElementsEditor.optionLabel(option.value)}
                            contentTestId={TestIds.formElementsEditor.optionContent(option.value)}
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
                                  data-testid={TestIds.formElementsEditor.buttonRemoveOption}
                                  onClick={() => onChange(options?.filter((o) => o.id !== option.id))}
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
                            <>
                              <InlineFieldRow>
                                <InlineField label="Type" labelWidth={6}>
                                  <Select
                                    options={SelectElementOptions}
                                    onChange={(event: SelectableValue) => {
                                      const newValue =
                                        event?.value === FormElementType.NUMBER
                                          ? Number(option.value) || 0
                                          : String(option.value);

                                      onChangeItem(
                                        {
                                          ...option,
                                          value: newValue,
                                          id: newValue,
                                          type: event?.value,
                                        },
                                        option
                                      );
                                    }}
                                    width={12}
                                    value={option.type}
                                    aria-label={TestIds.formElementsEditor.fieldOptionType}
                                  />
                                </InlineField>
                                {(!option.type || option.type === FormElementType.STRING) && (
                                  <InlineField label="Value" labelWidth={6} grow={true}>
                                    <Input
                                      placeholder="string"
                                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        onChangeItem(
                                          {
                                            ...option,
                                            value: event.target.value,
                                          },
                                          option,
                                          true
                                        );
                                      }}
                                      onBlur={() => {
                                        const isUpdated = onChangeItem(
                                          {
                                            ...option,
                                            id: option.value,
                                          },
                                          option
                                        );

                                        if (isUpdated && option.value !== option.id) {
                                          /**
                                           * Open content with new id
                                           */
                                          onToggleVisibility(option.value);
                                        }
                                      }}
                                      value={option.value}
                                      data-testid={TestIds.formElementsEditor.fieldOptionValue}
                                    />
                                  </InlineField>
                                )}
                                {option.type === FormElementType.NUMBER && (
                                  <InlineField label="Value" labelWidth={6} grow={true}>
                                    <Input
                                      type="number"
                                      placeholder="number"
                                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                        onChangeItem(
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
                                      data-testid={TestIds.formElementsEditor.fieldOptionNumberValue}
                                    />
                                  </InlineField>
                                )}
                              </InlineFieldRow>
                              <InlineFieldRow>
                                <InlineField label="Icon" labelWidth={6}>
                                  <Select
                                    onChange={(event) => {
                                      onChangeItem({
                                        ...option,
                                        icon: event?.value,
                                      });
                                    }}
                                    options={IconOptions}
                                    isClearable={true}
                                    value={option.icon}
                                    width={12}
                                    aria-label={TestIds.formElementsEditor.fieldOptionIcon}
                                  />
                                </InlineField>
                                <InlineField label="Label" labelWidth={6} grow={true} shrink={true}>
                                  <Input
                                    placeholder="label"
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                      onChangeItem({
                                        ...option,
                                        label: event.target.value,
                                      });
                                    }}
                                    value={option.label}
                                    data-testid={TestIds.formElementsEditor.fieldOptionLabel}
                                  />
                                </InlineField>
                              </InlineFieldRow>
                            </>
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
            const newOption = { id: '', value: '', label: '', type: FormElementType.STRING };

            onChange(options ? options.concat(newOption) : [newOption]);
            onToggleVisibility(newOption.id);
          }}
          icon="plus"
          data-testid={TestIds.formElementsEditor.buttonAddOption}
          size="sm"
          disabled={options.some((option) => option.id === '')}
        >
          Add Option
        </Button>
      </div>
    </>
  );
};
