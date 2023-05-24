import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { getLayoutSectionsEditorSelectors } from '../../test-utils';
import { LayoutSectionsEditor } from './LayoutSectionsEditor';

/**
 * Layout Sections Editor
 */
describe('Layout Sections Editor', () => {
  const onChange = jest.fn();

  /**
   * Layout Sections Editor Selectors
   */
  const selectors = getLayoutSectionsEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param restProps
   */
  const getComponent = ({ value = [], ...restProps }: any) => {
    return <LayoutSectionsEditor {...restProps} value={value} />;
  };

  /**
   * Sections
   */
  it('Should find component with sections', async () => {
    const sections = [{ name: 'Section' }, { name: 'Section 2' }];

    render(getComponent({ value: sections, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.buttonAdd()).toBeInTheDocument();

    /**
     * Section 1 presence
     */
    const section1 = selectors.section(false, 'Section');
    expect(section1).toBeInTheDocument();
    expect(getLayoutSectionsEditorSelectors(within(section1)).buttonRemove()).toBeInTheDocument();

    /**
     * Section 2 presence
     */
    const section2 = selectors.section(false, 'Section 2');
    expect(section2).toBeInTheDocument();
    expect(getLayoutSectionsEditorSelectors(within(section2)).buttonRemove()).toBeInTheDocument();
  });

  /**
   * No sections
   */
  it('Should find component without sections', async () => {
    render(getComponent({ value: null, onChange }));

    expect(selectors.fieldName(true)).not.toBeInTheDocument();
    expect(selectors.buttonAdd()).toBeInTheDocument();
  });

  /**
   * Change value
   */
  it('Should change name value', () => {
    const sections = [{ name: 'Section' }];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, 'Section');
    expect(section).toBeInTheDocument();

    /**
     * Change section name
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    fireEvent.change(sectionSelectors.fieldName(), { target: { value: 'newName' } });

    /**
     * Check if name is changed
     */
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'newName',
        }),
      ])
    );
  });

  /**
   * Remove section
   */
  it('Should remove section', () => {
    let sections = [{ name: 'Section 1' }, { name: 'Section 2' }];
    const onChange = jest.fn((updatedSections) => (sections = updatedSections));

    /**
     * Render
     */
    const { rerender } = render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, 'Section 2');
    expect(section).toBeInTheDocument();

    /**
     * Remove section
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    fireEvent.click(sectionSelectors.buttonRemove());

    /**
     * Rerender with updated sections
     */
    rerender(getComponent({ value: sections, onChange }));

    /**
     * Check if section is removed
     */
    expect(selectors.section(false, 'Section 1')).toBeInTheDocument();
    expect(selectors.section(true, 'Section 2')).not.toBeInTheDocument();
  });

  /**
   * Add section
   */
  it('Should add section', () => {
    let sections = [{ name: 'Section 1' }];
    const onChange = jest.fn((updatedSections) => (sections = updatedSections));

    /**
     * Render
     */
    const { rerender } = render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, 'Section 1');
    expect(section).toBeInTheDocument();

    /**
     * Add section
     */
    fireEvent.click(selectors.buttonAdd());

    /**
     * Rerender with updated sections
     */
    rerender(getComponent({ value: sections, onChange }));

    /**
     * Check if section is removed
     */
    expect(selectors.section(false, 'Section 1')).toBeInTheDocument();
    expect(selectors.section(false, '')).toBeInTheDocument();
  });
});
