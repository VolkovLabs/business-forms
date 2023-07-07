import React, { ChangeEvent, useCallback, useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { Alert, Button, CollapsableSection, InlineField, Input, Select } from '@grafana/ui';
import { FormElementDefault, FormElementTypeOptions, TestIds } from '../../../../constants';
import { FormElement } from '../../../../types';
import { GetElementUniqueId, GetElementWithNewType, IsElementConflict } from '../../../../utils';

/**
 * Properties
 */
interface Props {
  elements: FormElement[];
  onSave: (element: FormElement) => void;
}

/**
 * New Element
 */
export const NewElement: React.FC<Props> = ({ onSave, elements }) => {
  /**
   * States
   */
  const [newElement, setNewElement] = useState(FormElementDefault);
  const [addElementError, setAddElementError] = useState<string | null>(null);

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
     * Save Element
     */
    const element = GetElementWithNewType(newElement, newElement.type);
    onSave({ ...element, uid: GetElementUniqueId(element) });

    /**
     * Reset input values
     */
    setNewElement(FormElementDefault);
  }, [elements, newElement, onSave]);

  return (
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
  );
};
