import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import { NumberInput } from './NumberInput';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof NumberInput>;

/**
 * In Test Ids
 */
const InTestIds = {
  field: 'data-testid field',
};

describe('Number Input', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(InTestIds);
  const selectors = getSelectors(screen);

  /**
   * Get Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <NumberInput min={1} max={10} data-testid={InTestIds.field} {...(props as any)} />;
  };

  it('Should allow to enter negative value', () => {
    const onChange = jest.fn();

    render(getComponent({ min: -100, onChange }));

    fireEvent.change(selectors.field(), { target: { value: '-75' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(-75);
  });

  it('Should allow to enter decimal value', () => {
    const onChange = jest.fn();

    render(getComponent({ min: -1, max: 1, step: 0.3, onChange }));

    fireEvent.change(selectors.field(), { target: { value: '0.9' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(0.9);

    onChange.mockClear();

    fireEvent.change(selectors.field(), { target: { value: '0.7' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('Should validate value on NaN and use min value', () => {
    const onChange = jest.fn();

    render(getComponent({ min: 15, max: 20, onChange }));

    fireEvent.change(selectors.field(), { target: { value: 'abc' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(15);
  });

  it('Should set min value', () => {
    const onChange = jest.fn();

    render(getComponent({ min: -1, onChange }));

    fireEvent.change(selectors.field(), { target: { value: '-75' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(-1);
  });

  it('Should set max value', () => {
    const onChange = jest.fn();

    render(getComponent({ max: 5, onChange }));

    fireEvent.change(selectors.field(), { target: { value: '75' } });
    fireEvent.blur(selectors.field());

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('Should set updated value', () => {
    const { rerender } = render(getComponent({ value: 5 }));

    expect(selectors.field()).toHaveValue('5');

    rerender(
      getComponent({
        value: 10,
      })
    );

    expect(selectors.field()).toHaveValue('10');
  });

  it('Should save value to enter press', () => {
    const onChange = jest.fn();

    render(getComponent({ onChange }));

    fireEvent.change(selectors.field(), { target: { value: '5' } });
    fireEvent.keyDown(selectors.field(), { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(5);
  });
});
