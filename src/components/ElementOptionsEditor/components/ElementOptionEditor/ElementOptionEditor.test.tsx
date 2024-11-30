import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { FormElementType } from '@/types';
import { getFormElementsEditorSelectors } from '@/utils';

import { ElementOptionEditor } from './ElementOptionEditor';

/**
 * Element option editor
 */
describe('Element Option Editor', () => {
  const onChange = jest.fn();

  /**
   * Form Elements Editor Selectors
   */
  const selectors = getFormElementsEditorSelectors(screen);

  /**
   * Get Tested Component
   * @param option
   * @param restProps
   */
  const getComponent = ({ option = {}, ...restProps }: any) => {
    return <ElementOptionEditor {...restProps} option={option} />;
  };

  it('Should update option type to number and convert value', async () => {
    const originalOption = { label: 'label', type: FormElementType.STRING, value: '123', id: '123' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionType()).toBeInTheDocument();
    expect(selectors.fieldOptionType()).toHaveValue(FormElementType.STRING);

    /**
     * Change option type
     */
    await act(() => fireEvent.change(selectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } }));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.NUMBER,
        value: 123,
      }),
      expect.objectContaining({
        type: FormElementType.STRING,
      })
    );
  });

  it('Should update option type to number and use default value if NaN', async () => {
    const originalOption = { label: 'label', type: FormElementType.STRING, value: 'abc', id: 'abc' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionType()).toBeInTheDocument();
    expect(selectors.fieldOptionType()).toHaveValue(FormElementType.STRING);

    /**
     * Change option type
     */
    await act(() => fireEvent.change(selectors.fieldOptionType(), { target: { value: FormElementType.NUMBER } }));

    // const updatedOption = openOption(elementSelectors, '0');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.NUMBER,
      }),
      expect.objectContaining({
        type: FormElementType.STRING,
      })
    );
  });

  it('Should update option type to string and convert value', async () => {
    const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 123, id: '123' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionType()).toBeInTheDocument();
    expect(selectors.fieldOptionType()).toHaveValue(FormElementType.NUMBER);

    /**
     * Change option type
     */
    await act(() => fireEvent.change(selectors.fieldOptionType(), { target: { value: FormElementType.STRING } }));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.STRING,
        value: '123',
      }),
      expect.objectContaining({
        type: FormElementType.NUMBER,
      })
    );
  });

  it('Should update option value for STRING option', async () => {
    const originalOption = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionValue()).toBeInTheDocument();
    expect(selectors.fieldOptionValue()).toHaveValue('111');

    await act(() => fireEvent.change(selectors.fieldOptionValue(), { target: { value: '123' } }));
    await act(() => fireEvent.blur(selectors.fieldOptionValue()));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.STRING,
        value: '123',
      }),
      expect.objectContaining({
        type: FormElementType.STRING,
      }),
      true
    );
  });

  it('Should update option value for NUMBER option', async () => {
    const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, id: '0' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionValue()).toBeInTheDocument();
    expect(selectors.fieldOptionValue()).toHaveValue(0);

    /**
     * Change option number value
     */
    await act(() => fireEvent.change(selectors.fieldOptionValue(), { target: { value: '123' } }));
    await act(() => fireEvent.blur(selectors.fieldOptionValue()));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.NUMBER,
        value: 123,
      }),
      expect.objectContaining({
        type: FormElementType.NUMBER,
        value: 0,
      }),
      true
    );
  });

  it('Should use default option id if empty value', async () => {
    const originalOption = { label: 'label', type: FormElementType.STRING, value: '111', id: '111' };

    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionValue()).toBeInTheDocument();
    expect(selectors.fieldOptionValue()).toHaveValue('111');

    await act(() => fireEvent.change(selectors.fieldOptionValue(), { target: { value: '' } }));
    await act(() => fireEvent.blur(selectors.fieldOptionValue()));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.STRING,
        value: '',
      }),
      expect.objectContaining({
        type: FormElementType.STRING,
        value: '111',
      }),
      true
    );
  });

  it('Should update option label', async () => {
    const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, id: '0' };
    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionLabel()).toBeInTheDocument();

    /**
     * Change option label
     */
    await act(() => fireEvent.change(selectors.fieldOptionLabel(), { target: { value: 'new label' } }));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.NUMBER,
        label: 'new label',
      })
    );
  });

  it('Should update option icon', async () => {
    const originalOption = { label: 'label', type: FormElementType.NUMBER, value: 0, icon: undefined, id: '0' };
    render(getComponent({ option: originalOption, onChangeItem: onChange }));

    expect(selectors.fieldOptionIcon()).toBeInTheDocument();

    /**
     * Change option icon
     */
    await act(() => fireEvent.change(selectors.fieldOptionIcon(), { target: { value: 'check' } }));

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: FormElementType.NUMBER,
        label: 'label',
        icon: 'check',
      })
    );
  });
});
