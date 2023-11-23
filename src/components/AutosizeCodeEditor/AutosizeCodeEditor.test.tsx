import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import React from 'react';

import { CODE_EDITOR_CONFIG } from '../../constants';
import { AutosizeCodeEditor } from './AutosizeCodeEditor';

/**
 * Properties
 */
type Props = React.ComponentProps<typeof AutosizeCodeEditor>;

/**
 * In Test Ids
 */
const InTestIds = {
  field: 'data-testid field',
};

/**
 * Mock Code Editor
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn(({ value, onChange, height }) => (
    <textarea
      data-testid={InTestIds.field}
      style={{ height }}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  )),
}));

describe('AutosizeCodeEditor', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(InTestIds);
  const selectors = getSelectors(screen);

  /**
   * Get Tested Component
   * @param value
   * @param item
   * @param restProps
   */
  const getComponent = ({ value = '', ...restProps }: Partial<Props>) => {
    return <AutosizeCodeEditor {...(restProps as any)} value={value} />;
  };

  it('Should apply min height if empty value', () => {
    render(getComponent({}));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.min}px`);
  });

  it('Should update height on change', () => {
    render(getComponent({}));

    const valueIn20Rows = Array.from(new Array(20))
      .map((value, index) => index)
      .join('\n');

    fireEvent.change(selectors.field(), { target: { value: valueIn20Rows } });

    expect(selectors.field()).toHaveStyle(`height: 360px`);
  });

  it('Should update height if props changed', () => {
    const { rerender } = render(getComponent({}));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.min}px`);

    const valueIn20Rows = Array.from(new Array(20))
      .map((value, index) => index)
      .join('\n');

    rerender(getComponent({ value: valueIn20Rows }));

    expect(selectors.field()).toHaveStyle(`height: 360px`);
  });

  it('Should apply max height', () => {
    const valueIn1000Rows = Array.from(new Array(1000))
      .map((value, index) => index)
      .join('\n');

    render(getComponent({ value: valueIn1000Rows }));

    expect(selectors.field()).toHaveStyle(`height: ${CODE_EDITOR_CONFIG.height.max}px`);
  });
});
