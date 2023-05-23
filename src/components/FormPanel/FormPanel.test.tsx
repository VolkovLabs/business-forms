import React from 'react';
import { screen, render } from '@testing-library/react';
import { ButtonOrientation, FormElementDefault, LayoutVariant } from '../../constants';
import { getPanelSelectors } from '../../test-utils';
import { FormPanel } from './FormPanel';

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Panel Selectors
   */
  const selectors = getPanelSelectors(screen);

  /**
   * Get Tested Component
   * @param modifiers
   * @param props
   */
  const getComponent = (modifiers: Array<'withDefaultElement'> = [], props: any = {}) => {
    const options: any = {
      submit: {},
      initial: {},
      update: {},
      reset: {},
      layout: { variant: LayoutVariant.SINGLE },
      buttonGroup: { orientation: ButtonOrientation.CENTER },
      elements: [],
    };
    const finalProps: any = {
      eventBus: {
        getStream: jest.fn().mockImplementation(() => ({
          subscribe: jest.fn().mockImplementation(() => ({
            unsubscribe: jest.fn(),
          })),
        })),
      },
      ...props,
    };

    if (modifiers.includes('withDefaultElement')) {
      options.elements.push(FormElementDefault);
    }

    return <FormPanel {...finalProps} options={options} />;
  };

  it('Should find component with Elements', () => {
    render(getComponent(['withDefaultElement']));
    expect(selectors.root()).toBeInTheDocument();
  });

  it('Should find component with Alert message', () => {
    render(getComponent());
    expect(selectors.infoMessage()).toBeInTheDocument();
  });
});
