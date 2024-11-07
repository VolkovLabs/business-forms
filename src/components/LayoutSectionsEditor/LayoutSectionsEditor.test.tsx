import { act, fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { LayoutOrientation, SectionVariant } from '../../constants';
import { getLayoutSectionsEditorSelectors } from '../../utils';
import { LayoutSectionsEditor } from './LayoutSectionsEditor';

/**
 * Props
 */
type Props = React.ComponentProps<typeof LayoutSectionsEditor>;

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
  const getComponent = ({ value = [], ...restProps }: Partial<Props>) => {
    return <LayoutSectionsEditor value={value} context={{}} {...(restProps as any)} />;
  };

  /**
   * Sections
   */
  it('Should find component with sections', async () => {
    const sections = [
      { id: 'Section', name: 'Section' },
      { id: 'Section 2', name: 'Section 2' },
    ];

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
    render(getComponent({ value: undefined, onChange }));

    expect(selectors.fieldName(true)).not.toBeInTheDocument();
    expect(selectors.buttonAdd()).toBeInTheDocument();
  });

  /**
   * Change id
   */
  it('Should change id value', async () => {
    const sections = [
      { id: '1', name: 'Section' },
      { id: '2', name: '' },
    ];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, '1');
    expect(section).toBeInTheDocument();

    /**
     * Change section name
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    expect(sectionSelectors.fieldId()).toHaveValue('1');
    await act(() => fireEvent.change(sectionSelectors.fieldId(), { target: { value: '11' } }));
    expect(sectionSelectors.fieldId()).toHaveValue('11');
  });

  it('Should clean id value', () => {
    const sections = [{ id: '1', name: 'Section' }];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, '1');
    expect(section).toBeInTheDocument();

    /**
     * Change section name
     */

    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    expect(sectionSelectors.fieldId()).toHaveValue('1');
    fireEvent.change(sectionSelectors.fieldId(), { target: { value: '' } });
    expect(sectionSelectors.fieldId()).toHaveValue('');
  });

  it('Should not allow use already existing id', () => {
    const sections = [
      { id: '1', name: 'Section' },
      { id: '2', name: 'Section' },
    ];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(getComponent({ value: sections, onChange }));

    /**
     * Check section presence
     */
    const section = selectors.section(false, '1');
    expect(section).toBeInTheDocument();

    /**
     * Change section name
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    fireEvent.change(sectionSelectors.fieldId(), { target: { value: '2' } });

    /**
     * Check if id is not changed
     */
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Should change name value', () => {
    const sections = [{ id: 'Section', name: 'Section' }];
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
    expect(sectionSelectors.fieldName()).toHaveValue('Section');

    fireEvent.change(sectionSelectors.fieldName(), { target: { value: 'newName' } });
    expect(sectionSelectors.fieldName()).toHaveValue('newName');
  });

  it('Should change expanded value for collapsable section variable', () => {
    const sections = [{ id: 'Section', name: 'Section', expanded: false }];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(
      getComponent({
        value: sections,
        onChange,
        context: {
          options: { layout: { orientation: LayoutOrientation.VERTICAL, sectionVariant: SectionVariant.COLLAPSABLE } },
        } as any,
      })
    );

    /**
     * Check section presence
     */
    const section = selectors.section(false, 'Section');
    expect(section).toBeInTheDocument();

    /**
     * Change section name
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    expect(sectionSelectors.fieldExpanded()).toBeInTheDocument();
    expect(sectionSelectors.fieldExpanded()).not.toBeChecked();
    fireEvent.click(sectionSelectors.fieldExpanded());
    expect(sectionSelectors.fieldExpanded()).toBeChecked();
  });

  it('Should hide expanded field if no collapsable variant', () => {
    const sections = [{ id: 'Section', name: 'Section', expanded: false }];
    const onChange = jest.fn();

    /**
     * Render
     */
    render(
      getComponent({
        value: sections,
        onChange,
        context: {
          options: { layout: { orientation: LayoutOrientation.VERTICAL, sectionVariant: SectionVariant.DEFAULT } },
        } as any,
      })
    );

    /**
     * Check section presence
     */
    const section = selectors.section(false, 'Section');
    expect(section).toBeInTheDocument();

    /**
     * Change expanded hidden
     */
    const sectionSelectors = getLayoutSectionsEditorSelectors(within(section));
    expect(sectionSelectors.fieldExpanded(true)).not.toBeInTheDocument();
  });

  it('Should remove section', () => {
    let sections = [
      { id: 'Section 1', name: 'Section 1' },
      { id: 'Section 2', name: 'Section 2' },
    ];
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

  it('Should add section', () => {
    let sections = [{ id: 'Section 1', name: 'Section 1' }];
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
