import { useCallback, useEffect, useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { FormElement } from '../types';
import { GetElementsWithUid, IsElementConflict, IsElementOptionConflict } from '../utils';
import { useAutoSave } from './useAutoSave';

/**
 * Use Form Elements
 * @param onChange
 * @param value
 * @param isAutoSave
 */
export const useFormElements = (
  onChange: (elements: FormElement[]) => void,
  value?: FormElement[],
  isAutoSave = true
) => {
  /**
   * States
   */
  const [elements, setElements] = useState<FormElement[]>(GetElementsWithUid(value));
  const [isChanged, setIsChanged] = useState(false);
  const { startTimer, removeTimer } = useAutoSave();

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    onChange(elements);
    setIsChanged(false);
  }, [elements, onChange]);

  /**
   * Change Elements
   */
  const onChangeElements = useCallback((newElements: FormElement[]) => {
    setElements(newElements);
    setIsChanged(true);
  }, []);

  /**
   * Change Element
   */
  const onChangeElement = useCallback(
    (updatedElement: FormElement, checkConflict = false) => {
      if (checkConflict && IsElementConflict(elements, updatedElement)) {
        alert('Element with the same id and type exists.');
        return;
      }

      onChangeElements(elements.map((element) => (element.uid === updatedElement.uid ? updatedElement : element)));
    },
    [elements, onChangeElements]
  );

  /**
   * Change Element Option
   */
  const onChangeElementOption = useCallback(
    (
      element: FormElement,
      updatedOption: SelectableValue,
      { value = updatedOption.value }: SelectableValue = {},
      checkConflict = false
    ) => {
      if ('options' in element) {
        if (checkConflict && IsElementOptionConflict(element.options || [], updatedOption)) {
          alert('Option with the same value exists');
          return;
        }

        onChangeElement({
          ...element,
          options: element.options?.map((item) => (item.value === value ? updatedOption : item)),
        });
      }
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
    setElements(GetElementsWithUid(value));
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
  };
};
