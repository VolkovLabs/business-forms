import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import {
  FORM_ELEMENT_DEFAULT,
  FormElementType,
  LayoutOrientation,
  LayoutVariant,
  SectionVariant,
} from '../../constants';
import { PanelOptions, UpdateEnabledMode } from '../../types';
import { getFormElementsSectionSelectors, normalizeElementsForLocalState } from '../../utils';
import { ElementSections } from './ElementSections';

/**
 * Props
 */
type Props = React.ComponentProps<typeof ElementSections>;

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
  const getComponent = ({ options = {} as any, ...restProps }: Partial<Props>) => {
    return (
      <table>
        <tbody>
          <ElementSections
            options={options}
            elements={normalizeElementsForLocalState(options.elements)}
            {...(restProps as any)}
          />
        </tbody>
      </table>
    );
  };

  describe('Render elements', () => {
    const options: PanelOptions = {
      sync: true,
      updateEnabled: UpdateEnabledMode.MANUAL,
      resetAction: {} as any,
      buttonGroup: {} as any,
      saveDefault: {} as any,
      confirmModal: {} as any,
      elementValueChanged: '',
      submit: {} as any,
      initial: { highlight: true } as any,
      update: {} as any,
      reset: {} as any,
      layout: {
        variant: LayoutVariant.SPLIT,
        orientation: LayoutOrientation.VERTICAL,
        sectionVariant: SectionVariant.COLLAPSABLE,
        sections: [
          { name: 'section1', id: 'section1', expanded: true },
          { name: 'section2', id: 'section2', expanded: true },
        ],
        padding: 0,
      },
      elements: [
        { ...FORM_ELEMENT_DEFAULT, id: 'string' },
        { id: 'password', type: FormElementType.PASSWORD, section: 'section1' } as any,
        { id: 'number', type: FormElementType.NUMBER, section: 'section1' } as any,
      ],
    };

    it('Should render Sections', () => {
      render(
        getComponent({
          options,
          onChangeElement,
          initial: { changed: 'bye' },
          sectionsExpandedState: { section1: true },
        })
      );

      expect(sectionSelectors.sectionHeader(true, 'section1', 'section1')).toBeInTheDocument();
    });

    it('Should toggle sections', () => {
      const onChangeSectionExpandedState = jest.fn();

      render(
        getComponent({
          options,
          onChangeElement,
          onChangeSectionExpandedState,
          initial: { changed: 'bye' },
          sectionsExpandedState: { section1: true },
        })
      );

      expect(sectionSelectors.sectionHeader(true, 'section1', 'section1')).toBeInTheDocument();

      fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'section1'));

      expect(onChangeSectionExpandedState).toHaveBeenCalledWith('section1', false);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
