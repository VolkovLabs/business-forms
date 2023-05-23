import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormElementDefault, FormElementType } from '../../constants';
import { getFormElementsSelectors } from '../../test-utils';
import { FormElements } from './FormElements';

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
 * Form Elements
 */
describe('Form Elements', () => {
  const onOptionsChange = jest.fn();
  /**
   * Form Elements Selectors
   */
  const elements = getFormElementsSelectors(screen);

  describe('Render elements', () => {
    beforeEach(() => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          FormElementDefault,
          { id: 'password', type: FormElementType.PASSWORD },
          { id: 'number', type: FormElementType.NUMBER },
          { id: 'textarea', type: FormElementType.TEXTAREA },
          { id: 'code', type: FormElementType.CODE },
          { id: 'boolean', type: FormElementType.BOOLEAN },
          { id: 'datetime', type: FormElementType.DATETIME },
          { id: 'radioGroup', type: FormElementType.RADIO },
        ],
      };

      const getComponent = ({ options = {}, ...restProps }: any) => {
        return <FormElements options={options} {...restProps} />;
      };

      render(getComponent({ options, onOptionsChange }));
    });

    it('Should render container', () => {
      expect(elements.root()).toBeInTheDocument();
    });

    it('Should render string field', () => {
      expect(elements.fieldString()).toBeInTheDocument();
    });

    it('Should render number field', () => {
      expect(elements.fieldNumber()).toBeInTheDocument();
    });

    it('Should render password field', () => {
      expect(elements.fieldPassword()).toBeInTheDocument();
    });

    it('Should render textarea field', () => {
      expect(elements.fieldTextarea()).toBeInTheDocument();
    });

    it('Should render code field', () => {
      expect(elements.fieldCode()).toBeInTheDocument();
    });

    it('Should render radio field', () => {
      expect(elements.fieldRadioContainer()).toBeInTheDocument();
    });

    it('Should render dateTime field', () => {
      expect(elements.fieldDateTime()).toBeInTheDocument();
    });
  });

  it('Should find component with Slider', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'slider', type: FormElementType.SLIDER, value: 0 }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    render(getComponent({ options, onOptionsChange }));
    expect(elements.fieldSliderContainer()).toBeInTheDocument();

    /**
     * Input
     */
    expect(elements.fieldSliderInput()).toBeInTheDocument();
  });

  it('Should find component with Radio', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'radio', type: FormElementType.RADIO }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    render(getComponent({ options, onOptionsChange }));

    /**
     * Radio
     */
    expect(elements.fieldRadioContainer()).toBeInTheDocument();
  });

  it('Should find component with Select', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    render(getComponent({ options, onOptionsChange }));

    /**
     * Select
     */
    expect(elements.fieldSelectContainer()).toBeInTheDocument();
  });

  it('Should not find component without section', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <FormElements options={options} {...restProps} />;
    };

    render(getComponent({ options, onOptionsChange, section: { name: 'left' } }));
    expect(elements.root()).toBeInTheDocument();

    /**
     * Select
     */
    expect(elements.fieldSelectContainer(true)).not.toBeInTheDocument();
  });
});
