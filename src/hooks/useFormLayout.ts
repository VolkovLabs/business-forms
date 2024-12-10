import { EventBusSrv, InterpolateFunction, SelectableValue } from '@grafana/data';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FormElement, LayoutSection, LayoutSectionWithElements, LocalFormElement } from '../types';
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
 * Form Layout
 * @param onChangeElementsOption
 * @param onChangeSectionsOption
 * @param value
 * @param isAutoSave
 * @param layoutSections
 * @param options
 */
export const useFormLayout = ({
  onChangeElementsOption,
  onChangeSectionsOption,
  value,
  isAutoSave = true,
  layoutSections,
  replaceVariables,
}: {
  replaceVariables?: InterpolateFunction;
  onChangeElementsOption?: (elements: FormElement[]) => void;
  value?: FormElement[];
  isAutoSave?: boolean;
  layoutSections?: LayoutSection[];
  onChangeSectionsOption?: (sections: LayoutSection[]) => void;
}) => {
  const eventBus = useRef(new EventBusSrv());

  /**
   * States
   */
  const [elements, setElements, elementsRef] = useMutableState<LocalFormElement[]>(
    normalizeElementsForLocalState(value, replaceVariables)
  );
  const [sections, setSections, sectionsRef] = useMutableState<LayoutSection[]>(layoutSections || []);
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
      setSections(newSections);
      setIsChanged(true);
    },
    [setSections]
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
      onChangeElements(
        setFormValueHandler(elementsRef.current, normalizeElementsForLocalState(value, replaceVariables), objectValues)
      );
    },
    [elementsRef, onChangeElements, replaceVariables, value]
  );

  /**
   * Update local elements
   */
  useEffect(() => {
    setElements(normalizeElementsForLocalState(value, replaceVariables));
    setIsChanged(false);
  }, [replaceVariables, setElements, value]);

  /**
   * Add new section
   */
  const addSection = useCallback(
    ({ name, id, elements }: { name: string; id: string; elements: string[] }) => {
      const sections = sectionsRef.current;
      const currentElements = elementsRef.current;
      const isSectionExisted = sections.some((section) => section.id === id);

      if (!isSectionExisted) {
        onChangeSections([
          ...sections,
          {
            name,
            id,
          },
        ]);
      }

      const updatedElements = currentElements.map((element) => {
        const elementToUpdate = elements.some((item) => item === element.id);
        if (elementToUpdate) {
          return {
            ...element,
            section: id,
          };
        }
        return element;
      });

      onChangeElements(updatedElements);
    },
    [elementsRef, onChangeElements, onChangeSections, sectionsRef]
  );

  /**
   * Remove Section
   */
  const removeSection = useCallback(
    (id: string) => {
      const sections = sectionsRef.current;
      onChangeSections(sections.filter((section) => section.id !== id));
    },
    [onChangeSections, sectionsRef]
  );

  /**
   * Assign to Section
   */
  const assignToSection = useCallback(
    (id: string, elements: string[]) => {
      const sections = sectionsRef.current;
      const section = sections.find((item) => item.id === id);

      if (!section) {
        return;
      }

      const currentElements = elementsRef.current;
      const updatedElements = currentElements.map((element) => {
        const elementToUpdate = elements.some((item) => item === element.id);
        if (elementToUpdate) {
          return {
            ...element,
            section: section.id,
          };
        }
        return element;
      });

      onChangeElements(updatedElements);
    },
    [elementsRef, onChangeElements, sectionsRef]
  );

  /**
   * Unassign from Section
   */
  const unassignFromSection = useCallback(
    (elements: string[]) => {
      const currentElements = elementsRef.current;
      const updatedElements = currentElements.map((element) => {
        const elementToUpdate = elements.some((item) => item === element.id);
        if (elementToUpdate) {
          return {
            ...element,
            section: '',
          };
        }
        return element;
      });

      onChangeElements(updatedElements);
    },
    [elementsRef, onChangeElements]
  );

  /**
   * Get Section
   */
  const getSection = useCallback(
    (id: string): LayoutSectionWithElements | undefined => {
      const sections = sectionsRef.current;
      const section = sections.find((section) => section.id === id);

      if (!section) {
        return;
      }

      const currentElements = elementsRef.current;
      const sectionElements = currentElements.filter((curElement) => curElement.section === section.name);
      return {
        ...section,
        elements: sectionElements,
      };
    },
    [elementsRef, sectionsRef]
  );

  /**
   * Get Section
   */
  const getAllSections = useCallback((): LayoutSectionWithElements[] => {
    const sections = sectionsRef.current;

    return sections.map((section): LayoutSectionWithElements => {
      const currentElements = elementsRef.current;
      const sectionElements = currentElements.filter((curElement) => curElement.section === section.name);
      return {
        ...section,
        elements: sectionElements,
      };
    });
  }, [elementsRef, sectionsRef]);

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
    addSection,
    removeSection,
    onChangeSections,
    assignToSection,
    unassignFromSection,
    getSection,
    getAllSections,
  };
};
