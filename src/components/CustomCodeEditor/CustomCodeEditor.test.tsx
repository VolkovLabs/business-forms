import React from 'react';
import { render, screen } from '@testing-library/react';
import { getCustomCodeEditorSelectors } from '../../test-utils';
import { CustomCodeEditor } from './CustomCodeEditor';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn().mockImplementation((props) => {
    return <div data-testid={props['data-testid']} />;
  }),
}));

/**
 * Custom Code Editor
 */
describe('Custom Code Editor', () => {
  /**
   * Custom Code Editor selectors
   */
  const selectors = getCustomCodeEditorSelectors(screen);

  it('Should find component', async () => {
    const getComponent = ({ value = [], item = {}, ...restProps }: any) => {
      return <CustomCodeEditor {...restProps} value={value} item={item} />;
    };

    render(getComponent({}));
    expect(selectors.root()).toBeInTheDocument();
  });
});
