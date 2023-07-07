import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '../../utils';
import { Collapse } from './Collapse';

type Props = React.ComponentProps<typeof Collapse>;

/**
 * In Test Ids
 */
const InTestIds = {
  header: 'data-testid header',
  content: 'data-testid content',
  buttonRemove: 'data-testid button-remove',
};

/**
 * Get Selectors
 */
const getSelectors = getJestSelectors(InTestIds);

describe('Collapse', () => {
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   */
  const getComponent = (props: Partial<Props>) => {
    return <Collapse headerTestId={InTestIds.header} contentTestId={InTestIds.content} {...props} />;
  };

  it('Should expand content', () => {
    const { rerender } = render(getComponent({ isOpen: false }));

    expect(selectors.content(true)).not.toBeInTheDocument();

    rerender(getComponent({ isOpen: true }));

    expect(selectors.content()).toBeInTheDocument();
  });

  it('Actions should not affect collapse state', () => {
    const onToggle = jest.fn();

    render(getComponent({ onToggle, actions: <button data-testid={InTestIds.buttonRemove}>remove</button> }));

    fireEvent.click(selectors.buttonRemove());

    expect(onToggle).not.toHaveBeenCalled();
  });
});
