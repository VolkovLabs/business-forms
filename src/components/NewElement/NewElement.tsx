import { SelectableValue } from '@grafana/data';
import { Alert, Button, CollapsableSection, InlineField, Input, Select } from '@grafana/ui';
import React, { ChangeEvent, useCallback, useState } from 'react';

import { FORM_ELEMENT_DEFAULT, FORM_ELEMENT_TYPE_OPTIONS, TEST_IDS } from '../../constants';
import { FormElement, LocalFormElement } from '../../types';
import { getElementWithNewType, isElementConflict, toLocalFormElement } from '../../utils';

/**
 * Properties
 */
interface Props {
  /**
   * Elements
   */
  elements: LocalFormElement[];

  /**
   * On Save
   */
  onSave: (element: LocalFormElement) => void;
}

/**
 * New Element
 */
export const NewElement: React.FC<Props> = ({ onSave, elements }) => {
  /**
   * States
   */
  const [newElement, setNewElement] = useState(FORM_ELEMENT_DEFAULT);
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
    if (isElementConflict(elements, newElement)) {
      setAddElementError('Element with the same Id and Type already exists');
      return;
    }

    /**
     * Save Element
     */
    onSave(getElementWithNewType(toLocalFormElement(newElement), newElement.type));

    /**
     * Reset input values
     */
    setNewElement(FORM_ELEMENT_DEFAULT);
  }, [elements, newElement, onSave]);

  return (
    <CollapsableSection
      label="New Element"
      isOpen={true}
      headerDataTestId={TEST_IDS.formElementsEditor.sectionNewLabel}
      contentDataTestId={TEST_IDS.formElementsEditor.sectionNewContent}
    >
      <InlineField label="Id" grow labelWidth={8} invalid={newElement.id === ''}>
        <Input
          placeholder="Id"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChangeNewElement({ ...newElement, id: event.target.value });
          }}
          value={newElement.id}
          data-testid={TEST_IDS.formElementsEditor.newElementId}
        />
      </InlineField>

      <InlineField label="Label" grow labelWidth={8} invalid={newElement.title === ''}>
        <Input
          placeholder="Label"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChangeNewElement({ ...newElement, title: event.target.value });
          }}
          value={newElement.title}
          data-testid={TEST_IDS.formElementsEditor.newElementLabel}
        />
      </InlineField>

      <InlineField label="Type" grow labelWidth={8}>
        <Select
          aria-label={TEST_IDS.formElementsEditor.newElementType}
          options={FORM_ELEMENT_TYPE_OPTIONS}
          onChange={(event?: SelectableValue) => {
            onChangeNewElement({ ...newElement, type: event?.value });
          }}
          value={FORM_ELEMENT_TYPE_OPTIONS.find((type) => type.value === newElement.type)}
        />
      </InlineField>

      {!!addElementError && (
        <Alert data-testid={TEST_IDS.formElementsEditor.addElementError} severity="error" title="Add Element">
          {addElementError}
        </Alert>
      )}

      <Button
        variant="secondary"
        onClick={onElementAdd}
        disabled={!newElement.id || !newElement.type || !!addElementError}
        icon="plus"
        data-testid={TEST_IDS.formElementsEditor.buttonAddElement}
      >
        Add Element
      </Button>
    </CollapsableSection>
  );
};
