import { EventBusSrv, SelectableValue } from '@grafana/data';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FormElement, LayoutSection, LocalFormElement, PanelOptions } from '../types';
import {
  convertElementsToPayload,
  isElementConflict,
  isElementOptionConflict,
  normalizeElementsForDashboard,
  normalizeElementsForLocalState,
  patchFormValueHandler,
  setFormValueHandler,
  ValueChangedEvent,
} from '../utils';
import { useAutoSave } from './useAutoSave';
import { useMutableState } from './useMutableState';

/**
 * Form Elements
 * @param onChangeElementsOption
 * @param value
 * @param isAutoSave
 * @param onItemChange
 */
export const useFormElements = ({
  onChangeElementsOption,
  onChangeSectionsOption,
  value,
  isAutoSave = true,
  layoutSections,
  options,
}: {
  onChangeElementsOption?: (elements: FormElement[]) => void;
  value?: FormElement[];
  isAutoSave?: boolean;
  layoutSections?: LayoutSection[];
  options?: PanelOptions;
  onChangeSectionsOption?: (sections: LayoutSection[]) => void;
}) => {
  const eventBus = useRef(new EventBusSrv());

  /**
   * States
   */
  const [elements, setElements, elementsRef] = useMutableState<LocalFormElement[]>(
    normalizeElementsForLocalState(value)
  );
  const [sections, setSections] = useState<LayoutSection[]>(layoutSections || []);
  const [isChanged, setIsChanged] = useState(false);
  const { startTimer, removeTimer } = useAutoSave();

  /**
   * Expand/Collapse State for Sections
   */
  const [sectionsExpandedState, setSectionsExpandedState] = useState<Record<string, boolean>>(
    sections.reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: section.expanded,
      }),
      {}
    )
  );

  /**
   * Change Sections
   */
  const onChangeSections = useCallback(
    (newSections: LayoutSection[]) => {
      setSections(
        newSections.map((item) => ({
          ...item,
          id: item.id,
        }))
      );
      setIsChanged(true);
    },
    [setSections]
  );

  /**
   * Add new section
   */
  const addSections = useCallback(
    (newSections: LayoutSection[]) => {
      if (options) {
        /**
         * Not existed sections
         */
        const currentSectionsToAdd = newSections.filter((element) =>
          sections.every((section) => section.id !== element.id)
        );

        onChangeSections([...sections, ...currentSectionsToAdd]);
      }
    },
    [onChangeSections, options, sections]
  );

  /**
   * Remove Section
   */
  const removeSection = useCallback(
    (id: string) => {
      if (options) {
        onChangeSections(sections.filter((section) => section.id !== id));
      }
    },
    [onChangeSections, options, sections]
  );

  /**
   * On Change Section Expanded State
   */
  const onChangeSectionExpandedState = useCallback((name: string, isExpanded: boolean) => {
    setSectionsExpandedState((prev) => ({
      ...prev,
      [name]: isExpanded,
    }));
  }, []);

  /**
   * Save Updates
   */
  const onSaveUpdates = useCallback(() => {
    if (onChangeElementsOption) {
      onChangeElementsOption(normalizeElementsForDashboard(elements));
    }
    if (onChangeSectionsOption) {
      onChangeSectionsOption(sections);
    }
    setIsChanged(false);
  }, [elements, onChangeElementsOption, onChangeSectionsOption, sections]);

  /**
   * Change Elements
   */
  const onChangeElements = useCallback(
    (newElements: LocalFormElement[]) => {
      setElements(newElements);
      setIsChanged(true);
    },
    [setElements]
  );

  /**
   * Change layout
   */
  const onChangeLayout = useCallback(
    (newElements: LocalFormElement[], newSections?: LayoutSection[]) => {
      /**
       * Section Ids from elements
       */
      const sectionIds = [...new Set(newElements.map((element) => element.section).filter((element) => !!element))];

      /**
       * Set Sections based on elements
       */
      const currentSections: LayoutSection[] = sectionIds.map((item) => ({
        name: item,
        id: item,
      }));

      let sectionsToChange: LayoutSection[] = [];

      if (newSections) {
        /**
         * Concat two array with sections and remove duplicate
         */
        sectionsToChange = [...currentSections, ...newSections].reduce((acc: LayoutSection[], item) => {
          const existing = acc.find((obj) => obj['id'] === item['id']);
          if (!existing) {
            acc.push(item);
          }
          return acc;
        }, []);
      } else {
        sectionsToChange = currentSections;
      }

      onChangeSections(sectionsToChange);
      setElements(newElements);
      setIsChanged(true);
    },
    [onChangeSections, setElements]
  );

  /**
   * Change Element
   */
  const onChangeElement = useCallback(
    (updatedElement: LocalFormElement, checkConflict = false) => {
      const elements = elementsRef.current;
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
    [elementsRef, onChangeElements]
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
      const elements = elementsRef.current;
      const updated = elements.filter((e) => e.uid !== uid);

      /**
       * Update Elements
       */
      onChangeElements(updated);
    },
    [elementsRef, onChangeElements]
  );

  /**
   * Patch Form Values
   */
  const patchFormValue = useCallback(
    (objectValues: Record<string, unknown>) =>
      onChangeElements(patchFormValueHandler(elementsRef.current, objectValues)),
    [elementsRef, onChangeElements]
  );

  /**
   * Form Values
   */
  const getFormValue = useCallback(() => {
    return convertElementsToPayload(elementsRef.current);
  }, [elementsRef]);

  /**
   * Patch Form Values
   */
  const setFormValue = useCallback(
    (objectValues: Record<string, unknown>) => {
      onChangeElements(setFormValueHandler(elementsRef.current, normalizeElementsForLocalState(value), objectValues));
    },
    [elementsRef, onChangeElements, value]
  );

  /**
   * Update local elements
   */
  useEffect(() => {
    setElements(normalizeElementsForLocalState(value));
    setIsChanged(false);
  }, [setElements, value]);

  /**
   * Update local sections
   */
  useEffect(() => {
    if (layoutSections) {
      setSections(layoutSections);
      setIsChanged(false);
    }
  }, [setSections, layoutSections]);

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
    elementsRef,
    sectionsExpandedState,
    onChangeSectionExpandedState,
    patchFormValue,
    setFormValue,
    getFormValue,
    sections,
    addSections,
    removeSection,
    onChangeSections,
    onChangeLayout,
  };
};
