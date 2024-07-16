import { StandardEditorProps } from '@grafana/data';
import { Button, InlineField, InlineFieldRow, Input, Label, Select, useTheme2 } from '@grafana/ui';
import React, { ChangeEvent } from 'react';

import { RequestMethod, TEST_IDS } from '../../constants';
import { useFormElements, useQueryFields } from '../../hooks';
import { FormElement, PanelOptions } from '../../types';
import { getStyles } from './InititalFieldsEditor.styles';

/**
 * Properties
 */
type Props = StandardEditorProps<FormElement[], null, PanelOptions>;

/**
 * Initial Fields Editor
 */
export const InitialFieldsEditor: React.FC<Props> = ({ value, onChange, context }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = getStyles(theme);

  /**
   * Form Elements State
   */
  const { elements, isChanged, onSaveUpdates, onChangeElement } = useFormElements({
    onChange,
    value,
  });

  const queryFields = useQueryFields({
    data: context.data,
    isEnabled: context.options?.initial?.method === RequestMethod.QUERY,
  });

  /**
   * Return
   */
  return (
    <div data-testid={TEST_IDS.initialFieldsEditor.root}>
      <p className={styles.description} data-testid={TEST_IDS.initialFieldsEditor.text}>
        {`${context.options?.initial?.method === RequestMethod.QUERY ? 'Query Fields' : 'Field Names'}. Specify a field name for appropriate form element`}
      </p>
      {elements.map((element) => {
        return context.options?.initial?.method === RequestMethod.DATASOURCE ? (
          <InlineFieldRow key={element.uid}>
            <Label className={styles.label}>
              {element.title} [{element.id}]
            </Label>
            <InlineField
              grow={true}
              label="Field Name"
              labelWidth={14}
              tooltip="Specify a field name from the Data Source response"
            >
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
            </InlineField>
          </InlineFieldRow>
        ) : (
          <InlineFieldRow key={element.uid}>
            <Label className={styles.label}>
              {element.title} [{element.id}]
            </Label>
            <InlineField grow={true} label="Query Field" labelWidth={14} tooltip="Specify a field name from the Query">
              <Select
                value={element.queryField?.value}
                options={queryFields}
                onChange={(item) => {
                  onChangeElement({
                    ...element,
                    queryField: item,
                  });
                }}
                aria-label={TEST_IDS.initialFieldsEditor.fieldFromQueryPicker}
                data-testid={TEST_IDS.initialFieldsEditor.fieldFromQueryPicker}
                isClearable={true}
              />
            </InlineField>
          </InlineFieldRow>
        );
      })}
      <div className={styles.buttonWrap}>
        {isChanged && (
          <Button onClick={onSaveUpdates} data-testid={TEST_IDS.initialFieldsEditor.buttonSaveChanges}>
            Save changes
          </Button>
        )}
      </div>
    </div>
  );
};
