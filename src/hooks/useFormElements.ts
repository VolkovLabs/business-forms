import { EventBusSrv, SelectableValue } from '@grafana/data';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FormElement, LocalFormElement } from '../types';
import {
  isElementConflict,
  isElementOptionConflict,
  normalizeElementsForDashboard,
  normalizeElementsForLocalState,
  ValueChangedEvent,
} from '../utils';
import { useAutoSave } from './useAutoSave';

/**
 * Form Elements
 * @param onChange
 * @param value
 * @param isAutoSave
 * @param onItemChange
 */
export const useFormElements = ({
  onChange,
  value,
  isAutoSave = true,
}: {
  onChange: (elements: FormElement[]) => void;
  value?: FormElement[];
  isAutoSave?: boolean;
}) => {
  const eventBus = useRef(new EventBusSrv());

  /**
   * States
   */
  const [elements, setElements] = useState<LocalFormElement[]>(normalizeElementsForLocalState(value));
  const [isChanged, setIsChanged] = useState(false);
  const { startTimer, removeTimer } = useAutoSave();

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(normalizeElementsForDashboard(elements));
    setIsChanged(false);
  }, [elements, onChange]);

  /**
   * Change Elements
   */
  const onChangeElements = useCallback((newElements: LocalFormElement[]) => {
    setElements(newElements);
    setIsChanged(true);
  }, []);

  /**
   * Change Element
   */
  const onChangeElement = useCallback(
    (updatedElement: LocalFormElement, checkConflict = false) => {
      if (checkConflict && isElementConflict(elements, updatedElement)) {
        alert('Element with the same id and type exists.');
        return;
      }

      let isValueChanged = false;

      const updatedElements = elements.map((element) => {
        if (element.uid === updatedElement.uid) {
          isValueChanged = updatedElement.value !== element.value;
          return updatedElement;
        }
        return element;
      });

      onChangeElements(updatedElements);

      if (isValueChanged) {
        eventBus.current.publish(
          new ValueChangedEvent({
            elements: updatedElements,
            element: updatedElement,
          })
        );
      }
    },
    [elements, onChangeElements]
  );

  /**
   * Change Element Option
   */
  const onChangeElementOption = useCallback(
    (
      element: LocalFormElement,
      updatedOption: SelectableValue,
      { value = updatedOption.value }: SelectableValue = {},
      checkConflict = false
    ): boolean => {
      if ('options' in element && element.options) {
        if (checkConflict && isElementOptionConflict(element.options, updatedOption)) {
          alert('Option with the same value exists');
          return false;
        }

        onChangeElement({
          ...element,
          options: element.options?.map((item) => (item.value === value ? updatedOption : item)),
        });

        return true;
      }

      return false;
    },

    [onChangeElement]
  );

  /**
   * Remove Element
   */
  const onElementRemove = useCallback(
    (uid: string) => {
      const updated = elements.filter((e) => e.uid !== uid);

      /**
       * Update Elements
       */
      onChangeElements(updated);
    },
    [elements, onChangeElements]
  );

  /**
   * Update local elements
   */
  useEffect(() => {
    setElements(normalizeElementsForLocalState(value));
    setIsChanged(false);
  }, [value]);

  /**
   * Auto Save Timer
   */
  useEffect(() => {
    if (isAutoSave && isChanged) {
      startTimer(onSaveUpdates);
    } else {
      removeTimer();
    }

    return () => {
      removeTimer();
    };
  }, [startTimer, isChanged, onSaveUpdates, removeTimer, isAutoSave]);

  /**
   * Return
   */
  return {
    elements,
    isChanged,
    onSaveUpdates,
    onChangeElements,
    onChangeElement,
    onChangeElementOption,
    onElementRemove,
    eventBus: eventBus.current,
  };
};
