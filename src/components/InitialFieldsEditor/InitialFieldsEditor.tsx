import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

import { RequestMethod, TEST_IDS } from '../../constants';
import { useFormElements, useQueryFields } from '../../hooks';
import { FormElement, PanelOptions } from '../../types';

/**
 * Properties
 */
type Props = StandardEditorProps<FormElement[], null, PanelOptions>;

/**
 * Initial Fields Editor
 */
export const InitialFieldsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * Form Elements State
   */
  const { elements, isChanged, onSaveUpdates, onChangeElement } = useFormElements({
    onChange,
    value,
  });

  /**
   * Query Fields
   */
  const queryFields = useQueryFields({
    data: context.data,
    isEnabled: context.options?.initial?.method === RequestMethod.QUERY,
  });

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.initialFieldsEditor.root}>
      {elements.map((element) => {
        return (
          <InlineFieldRow key={element.uid}>
            <InlineField grow={true} label={element.title} labelWidth={14}>
              {context.options?.initial?.method === RequestMethod.DATASOURCE ? (
                <Input
                  value={element.fieldName || ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChangeElement({
                      ...element,
                      fieldName: event.target.value,
                    });
                  }}
                  data-testid={TEST_IDS.initialFieldsEditor.fieldNamePicker}
                />
              ) : (
                <Select
                  value={element.queryField?.value}
                  options={queryFields}
                  onChange={(item) => {
                    onChangeElement({
                      ...element,
                      queryField: item,
                    });
                  }}
                  data-testid={TEST_IDS.initialFieldsEditor.fieldFromQueryPicker}
                  isClearable={true}
                />
              )}
            </InlineField>
          </InlineFieldRow>
        );
      })}

      {isChanged && (
        <Button onClick={onSaveUpdates} data-testid={TEST_IDS.initialFieldsEditor.buttonSaveChanges}>
          Save changes
        </Button>
      )}
    </div>
  );
};
