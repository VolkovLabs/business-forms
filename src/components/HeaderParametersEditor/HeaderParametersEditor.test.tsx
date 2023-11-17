import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import { getHeaderParametersEditorSelectors } from '../../utils';
import { HeaderParametersEditor } from './HeaderParametersEditor';

/**
 * Header Parameters Editor
 */
describe('Header Parameters Editor', () => {
  const onChange = jest.fn();

  /**
   * Header Parameters Editor Selectors
   */
  const selectors = getHeaderParametersEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
    return <HeaderParametersEditor {...restProps} value={value} context={context} />;
  };

  /**
   * Parameters
   */
  it('Should find component with parameters', async () => {
    const parameters = [{ name: 'Authorization', value: 'Token' }];

    /**
     * Render
     */
    render(getComponent({ value: parameters, onChange }));

    /**
     * Check root presence
     */
    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.buttonAdd()).toBeInTheDocument();

    /**
     * Check Authorization Parameter presence
     */
    const authorizationParameter = selectors.parameter(false, 'Authorization');
    expect(authorizationParameter).toBeInTheDocument();

    /**
     * Check Authorization Parameter Fields presence
     */
    const authorizationParameterSelectors = getHeaderParametersEditorSelectors(within(authorizationParameter));
    expect(authorizationParameterSelectors.fieldName()).toBeInTheDocument();
    expect(authorizationParameterSelectors.fieldValue()).toBeInTheDocument();
    expect(authorizationParameterSelectors.buttonRemove()).toBeInTheDocument();
  });

  /**
   * No parameters
   */
  it('Should find component without parameters', async () => {
    render(getComponent({ value: null, onChange }));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.fieldName(true)).not.toBeInTheDocument();
    expect(selectors.buttonAdd()).toBeInTheDocument();
  });

  /**
   * Change Parameters
   */
  it('Should change parameters', () => {
    const onChange = jest.fn();

    /**
     * Render
     */
    render(getComponent({ value: [{ name: 'Authorization', value: 'Token' }], onChange }));

    /**
     * Change name
     */
    fireEvent.change(selectors.fieldName(), { target: { value: 'newName' } });

    /**
     * Check if name is updated
     */
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'newName',
        }),
      ])
    );

    /**
     * Change value
     */
    fireEvent.change(selectors.fieldValue(), { target: { value: 'newValue' } });

    /**
     * Check if value is updated
     */
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'newValue',
        }),
      ])
    );
  });

  /**
   * Remove Parameter
   */
  it('Should remove parameter', () => {
    let value = [
      { name: 'Authorization', value: 'auth' },
      { name: 'Token', value: 'accessToken' },
    ];
    const onChange = jest.fn((parameters) => (value = parameters));

    /**
     * Render
     */
    const { rerender } = render(getComponent({ value, onChange }));

    /**
     * Check if all parameters are rendered
     */
    const authorizationParameter = selectors.parameter(false, 'Authorization');
    expect(authorizationParameter).toBeInTheDocument();
    expect(selectors.parameter(false, 'Token')).toBeInTheDocument();

    /**
     * Remove Parameter
     */
    const parameterSelectors = getHeaderParametersEditorSelectors(within(authorizationParameter));
    fireEvent.click(parameterSelectors.buttonRemove());

    /**
     * Rerender with updated parameters
     */
    rerender(getComponent({ value, onChange }));

    /**
     * Check if only Token parameter is rendered
     */
    expect(selectors.parameter(true, 'Authorization')).not.toBeInTheDocument();
    expect(selectors.parameter(false, 'Token')).toBeInTheDocument();
  });

  /**
   * Add Parameter
   */
  it('Should add parameter', () => {
    let value = [{ name: 'Authorization', value: 'auth' }];
    const onChange = jest.fn((parameters) => (value = parameters));

    /**
     * Render
     */
    const { rerender } = render(getComponent({ value, onChange }));

    /**
     * Add Parameter
     */
    fireEvent.click(selectors.buttonAdd());

    /**
     * Rerender with updated parameters
     */
    rerender(getComponent({ value, onChange }));

    /**
     * Check if new parameter is rendered
     */
    expect(selectors.parameter(false, '')).toBeInTheDocument();
  });
});
