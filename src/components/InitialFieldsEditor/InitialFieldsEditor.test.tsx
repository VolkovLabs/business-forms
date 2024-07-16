import { toDataFrame } from '@grafana/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FORM_ELEMENT_DEFAULT, RequestMethod } from '../../constants';
import { getInitialFieldsEditorSelectors } from '../../utils';
import { InitialFieldsEditor } from './InitialFieldsEditor';

/**
 * Form Elements Editor
 */
describe('Form Elements Editor', () => {
  /**
   * OnChange function
   */
  const onChange = jest.fn();

  /**
   * Form Elements Editor Selectors
   */
  const selectors = getInitialFieldsEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param context
   * @param restProps
   */
  const getComponent = ({ value = [], context = {}, ...restProps }: any) => {
    return <InitialFieldsEditor {...restProps} value={value} context={context} />;
  };

  it('Should render component for Datasource method', async () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];
    render(
      getComponent({
        value: elements,
        onChange,
        context: { options: { initial: { method: RequestMethod.DATASOURCE } } },
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.text()).toBeInTheDocument();
    expect(selectors.text()).toHaveTextContent('Field Names. Specify a field name for appropriate form element');
  });

  it('Should render component for QUERY method', async () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];
    render(
      getComponent({
        value: elements,
        onChange,
        context: { options: { initial: { method: RequestMethod.QUERY } } },
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.text()).toBeInTheDocument();
    expect(selectors.text()).toHaveTextContent('Query Fields. Specify a field name for appropriate form element');
  });

  it('Should change Field Name', async () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id', fieldName: 'max' }];
    render(
      getComponent({
        value: elements,
        onChange,
        context: { options: { initial: { method: RequestMethod.DATASOURCE } } },
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.text()).toBeInTheDocument();
    expect(selectors.text()).toHaveTextContent('Field Names. Specify a field name for appropriate form element');

    expect(selectors.fieldNamePicker()).toBeInTheDocument();
    expect(selectors.fieldNamePicker()).toHaveValue('max');

    /**
     * Change field name
     */
    await act(() => fireEvent.change(selectors.fieldNamePicker(), { target: { value: 'metric' } }));

    expect(selectors.fieldNamePicker()).toHaveValue('metric');
  });

  it('Should change Query Name', async () => {
    const elements = [{ ...FORM_ELEMENT_DEFAULT, id: 'id' }];
    const context = {
      options: {
        initial: {
          method: RequestMethod.QUERY,
        },
      },
      data: [
        toDataFrame({
          fields: [
            {
              name: 'field1',
              values: [],
            },
            {
              name: 'field2',
              values: [],
            },
          ],
          refId: 'A',
        }),
      ],
    };

    render(
      getComponent({
        value: elements,
        onChange,
        context,
      })
    );

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.text()).toBeInTheDocument();
    expect(selectors.text()).toHaveTextContent('Query Fields. Specify a field name for appropriate form element');

    expect(selectors.fieldNamePicker(true)).not.toBeInTheDocument();

    expect(selectors.fieldFromQueryPicker()).toHaveValue('');

    /**
     * Change query field name
     */
    await act(() => fireEvent.change(selectors.fieldFromQueryPicker(), { target: { value: 'field1' } }));

    expect(selectors.fieldFromQueryPicker()).toHaveValue('field1');
  });
});
