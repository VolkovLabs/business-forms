import React from 'react';
import { render, screen, within } from '@testing-library/react';
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
});
