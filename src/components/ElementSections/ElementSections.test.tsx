import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FORM_ELEMENT_DEFAULT, FormElementType, LayoutOrientation, LayoutVariant } from '../../constants';
import { getFormElementsSectionSelectors, normalizeElementsForLocalState } from '../../utils';
import { ElementSections } from './ElementSections';

/**
 * Mock @volkovlabs/components
 */
jest.mock('@volkovlabs/components');

/**
 * Form Elements
 */
describe('Form Elements', () => {
  const onChangeElement = jest.fn();
  /**
   * Form Elements Selectors
   */
  const sectionSelectors = getFormElementsSectionSelectors(screen);

  /**
   * Get tested component
   * @param options
   * @param restProps
   */
  const getComponent = ({ options = {}, ...restProps }: any) => {
    return (
      <table>
        <tbody>
          <ElementSections
            options={options}
            elements={normalizeElementsForLocalState(options.elements)}
            {...restProps}
          />
        </tbody>
      </table>
    );
  };

  describe('Render elements', () => {
    const options = {
      submit: {},
      initial: { highlight: true },
      update: {},
      reset: {},
      layout: {
        variant: LayoutVariant.SPLIT,
        orientation: LayoutOrientation.VERTICAL,
        collapse: 'collapse',
        sections: [
          { name: 'section1', id: 'section1' },
          { name: 'section2', id: 'section2' },
        ],
      },
      elements: [
        { ...FORM_ELEMENT_DEFAULT, id: 'string' },
        { id: 'password', type: FormElementType.PASSWORD, section: 'section1' },
        { id: 'number', type: FormElementType.NUMBER, section: 'section1' },
      ],
    };

    it('Should render Sections', () => {
      const onToggleSection = jest.fn();

      render(
        getComponent({
          options,
          onChangeElement,
          onToggleSection,
          initial: { changed: 'bye' },
          expandSectionsState: { section1: true },
        })
      );

      expect(sectionSelectors.sectionLabel(true, 'section1', 'section1')).toBeInTheDocument();
    });

    it('Should toggle sections', () => {
      const onToggleSection = jest.fn();

      render(
        getComponent({
          options,
          onChangeElement,
          onToggleSection,
          initial: { changed: 'bye' },
          expandSectionsState: { section1: true },
        })
      );

      expect(sectionSelectors.sectionLabel(true, 'section1', 'section1')).toBeInTheDocument();

      fireEvent.click(sectionSelectors.sectionLabel(true, 'section1', 'section1'));

      expect(onToggleSection).toHaveBeenCalledWith('section1');
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
