import { getTemplateSrv } from '@grafana/runtime';
import { CodeEditor, CodeEditorSuggestionItemKind } from '@grafana/ui';
import { render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';

import { CODE_EDITOR_SUGGESTIONS } from '@/constants';
import { CodeEditorType } from '@/types';
import { getCustomCodeEditorSelectors } from '@/utils';

import { CustomCodeEditor } from './CustomCodeEditor';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getTemplateSrv: jest.fn(),
}));

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Custom Code Editor
 */
describe('Custom Code Editor', () => {
  /**
   * Custom Code Editor selectors
   */
  const selectors = getCustomCodeEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param item
   * @param restProps
   */
  const getComponent = ({ value = '', item = {}, ...restProps }: any) => {
    return <CustomCodeEditor {...restProps} value={value} item={item} />;
  };

  it('Should find component', async () => {
    render(getComponent({}));
    expect(selectors.root()).toBeInTheDocument();
  });

  /**
   * Minimap
   */
  it('Should show mini map if value more than 100 symbols', () => {
    render(getComponent({ value: new Array(102).join('1') }));

    expect(CodeEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        showMiniMap: true,
      }),
      expect.anything()
    );
  });

  /**
   * Formatting
   */
  it('Should enable formatting if enabled', () => {
    const runFormatDocument = jest.fn();
    const editor = {
      getAction: jest.fn().mockImplementation(() => ({
        run: runFormatDocument,
      })),
    };

    jest.mocked(CodeEditor).mockImplementationOnce(({ onEditorDidMount }: any) => {
      useEffect(() => {
        onEditorDidMount(editor);
      }, [onEditorDidMount]);
      return null;
    });

    /**
     * Render
     */
    render(getComponent({}));
    jest.runAllTimers();

    /**
     * Check if formatDocument is run
     */
    expect(CodeEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        monacoOptions: {
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        },
      }),
      expect.anything()
    );
    expect(editor.getAction).toHaveBeenCalledWith('editor.action.formatDocument');
    expect(runFormatDocument).toHaveBeenCalled();
  });

  /**
   * On Blur
   */
  it('Should save changes on blur', () => {
    const value = 'some value';
    const onChange = jest.fn();

    jest.mocked(CodeEditor).mockImplementationOnce(({ onBlur }: any) => {
      onBlur(value);
      return null;
    });

    /**
     * Render
     */
    render(
      getComponent({
        onChange,
      })
    );

    /**
     * Check if onChange is called
     */
    expect(onChange).toHaveBeenCalledWith(value);
  });

  /**
   * On Save
   */
  it('Should pass value on save', () => {
    const value = 'some value';
    const onChange = jest.fn();

    jest.mocked(CodeEditor).mockImplementationOnce(({ onSave }: any) => {
      onSave(value);
      return null;
    });

    /**
     * Render
     */
    render(
      getComponent({
        onChange,
      })
    );

    /**
     * Check if onChange is called
     */
    expect(onChange).toHaveBeenCalledWith(value);
  });

  /**
   * Suggestions
   */
  it('Should make correct suggestions', () => {
    let suggestionsResult;
    const variableWithDescription = { name: 'var1', description: 'Var description', label: 'Var Label' };
    const variableWithoutDescription = { name: 'var2', description: '', label: 'Var 2' };
    const variables = [variableWithDescription, variableWithoutDescription];

    jest.mocked(CodeEditor).mockImplementationOnce(({ getSuggestions }: any) => {
      suggestionsResult = getSuggestions();
      return null;
    });
    jest.mocked(getTemplateSrv).mockImplementationOnce(
      () =>
        ({
          getVariables: jest.fn().mockImplementation(() => variables),
        }) as any
    );

    /**
     * Render
     */
    render(
      getComponent({
        item: {
          settings: {
            type: CodeEditorType.REQUEST,
            variablesSuggestions: true,
          },
        },
      })
    );

    /**
     * Check if suggestions are correct
     */
    expect(suggestionsResult).toEqual(expect.arrayContaining(CODE_EDITOR_SUGGESTIONS.request));
    expect(suggestionsResult).toEqual(
      expect.arrayContaining([
        {
          label: `\$\{${variableWithDescription.name}\}`,
          kind: CodeEditorSuggestionItemKind.Property,
          detail: variableWithDescription.description,
        },
      ])
    );
    expect(suggestionsResult).toEqual(
      expect.arrayContaining([
        {
          label: `\$\{${variableWithoutDescription.name}\}`,
          kind: CodeEditorSuggestionItemKind.Property,
          detail: variableWithoutDescription.label,
        },
      ])
    );
  });

  it('Should not add suggestions', () => {
    let suggestionsResult;
    const variableWithDescription = { name: 'var1', description: 'Var description', label: 'Var Label' };
    const variableWithoutDescription = { name: 'var2', description: '', label: 'Var 2' };
    const variables = [variableWithDescription, variableWithoutDescription];

    jest.mocked(CodeEditor).mockImplementationOnce(({ getSuggestions }: any) => {
      suggestionsResult = getSuggestions();
      return null;
    });
    jest.mocked(getTemplateSrv).mockImplementationOnce(
      () =>
        ({
          getVariables: jest.fn().mockImplementation(() => variables),
        }) as any
    );

    /**
     * Render
     */
    render(
      getComponent({
        item: {
          settings: {},
        },
      })
    );

    /**
     * Check if suggestions are not added
     */
    expect(suggestionsResult).toEqual([]);
  });
});
