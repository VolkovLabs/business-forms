import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { getHeaderParametersEditorSelectors } from '../../test-utils';
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

    render(getComponent({ value: parameters, onChange }));
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
});
