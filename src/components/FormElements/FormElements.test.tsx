import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { FormElementDefault, FormElementType } from '../../constants';
import { getFormElementsSelectors } from '../../utils';
import { FormElements } from './FormElements';

/**
 * Mock @grafana/ui
 */
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: jest.fn().mockImplementation(({ onBlur, ...restProps }) => {
    return (
      <input
        data-testid={restProps['data-testid']}
        onBlur={(event) => {
          if (onBlur) {
            onBlur(event.target.value);
          }
        }}
      />
    );
  }),
  /**
   * Mock DatetimePicker component
   */
  DateTimePicker: jest.fn().mockImplementation(({ onChange, ...restProps }) => {
    return (
      <input
        data-testid={restProps['data-testid']}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value);
          }
        }}
      />
    );
  }),
  /**
   * Mock Select component
   */
  Select: jest.fn().mockImplementation(({ options, onChange, ...restProps }) => (
    <select
      onChange={(event: any) => {
        if (onChange) {
          onChange(options.find((option: any) => option.value === event.target.value));
        }
      }}
      {...restProps}
    >
      {options.map(({ label, value }: any) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )),
}));

/**
 * Mock rc-slider
 */
jest.mock('rc-slider', () =>
  jest.fn().mockImplementation(({ onChange, ariaLabelForHandle }) => {
    return (
      <input
        onChange={(event) => {
          if (onChange) {
            onChange(Number(event.target.value));
          }
        }}
        aria-label={ariaLabelForHandle}
      />
    );
  })
);

/**
 * Form Elements
 */
describe('Form Elements', () => {
  const onOptionsChange = jest.fn();
  /**
   * Form Elements Selectors
   */
  const selectors = getFormElementsSelectors(screen);

  /**
   * Get tested component
   * @param options
   * @param restProps
   */
  const getComponent = ({ options = {}, ...restProps }: any) => {
    return <FormElements options={options} {...restProps} />;
  };

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
          { id: 'disabled', type: FormElementType.DISABLED },
        ],
      };

      render(getComponent({ options, onOptionsChange }));
    });

    it('Should render container', () => {
      expect(selectors.root()).toBeInTheDocument();
    });

    it('Should render string field', () => {
      expect(selectors.fieldString()).toBeInTheDocument();
    });

    it('Should render number field', () => {
      expect(selectors.fieldNumber()).toBeInTheDocument();
    });

    it('Should render password field', () => {
      expect(selectors.fieldPassword()).toBeInTheDocument();
    });

    it('Should render textarea field', () => {
      expect(selectors.fieldTextarea()).toBeInTheDocument();
    });

    it('Should render code field', () => {
      expect(selectors.fieldCode()).toBeInTheDocument();
    });

    it('Should render radio field', () => {
      expect(selectors.fieldRadioContainer()).toBeInTheDocument();
    });

    it('Should render dateTime field', () => {
      expect(selectors.fieldDateTime()).toBeInTheDocument();
    });

    it('Should render disabled field', () => {
      expect(selectors.fieldDisabled()).toBeInTheDocument();
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

    render(getComponent({ options, onOptionsChange }));
    expect(selectors.fieldSlider()).toBeInTheDocument();

    /**
     * Input
     */
    expect(selectors.fieldSliderInput()).toBeInTheDocument();
  });

  it('Should find component with Radio', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'radio', type: FormElementType.RADIO }],
    };

    render(getComponent({ options, onOptionsChange }));

    /**
     * Radio
     */
    expect(selectors.fieldRadioContainer()).toBeInTheDocument();
  });

  it('Should find component with Select', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.SELECT }],
    };

    render(getComponent({ options, onOptionsChange }));

    /**
     * Select
     */
    expect(selectors.fieldSelect()).toBeInTheDocument();
  });

  it('Should find unit element', async () => {
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [{ id: 'select', type: FormElementType.STRING, unit: '123' }],
    };

    render(getComponent({ options, onOptionsChange }));

    /**
     * Unit
     */
    expect(selectors.unit()).toBeInTheDocument();
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
    expect(selectors.root()).toBeInTheDocument();

    /**
     * Select
     */
    expect(selectors.fieldSelect(true)).not.toBeInTheDocument();
  });

  /**
   * Field updates
   */
  describe('Field updates', () => {
    const runFieldChangeScenario = ({
      name,
      elements = [{ id: 'number', type: FormElementType.NUMBER }],
      getField,
      newValue,
      shouldContainResult,
    }: {
      name: string;
      getField: () => HTMLElement;
      newValue: unknown;
      elements?: unknown[];
      shouldContainResult: any;
    }) => {
      it(name, () => {
        const options = {
          submit: {},
          initial: { highlightColor: false },
          update: {},
          reset: {},
          elements,
        };
        const onOptionsChange = jest.fn();

        render(getComponent({ options, onOptionsChange }));

        fireEvent.change(getField(), { target: { value: newValue } });
        expect(onOptionsChange).toHaveBeenCalledWith(
          expect.objectContaining({
            elements: expect.arrayContaining([expect.objectContaining(shouldContainResult)]),
          })
        );
      });
    };

    /**
     * Number
     */
    describe('Number Field', () => {
      [
        {
          name: 'Should update value',
          elements: [{ id: 'number', type: FormElementType.NUMBER }],
          getField: selectors.fieldNumber,
          newValue: '123',
          shouldContainResult: {
            value: '123',
          },
        },
        {
          name: 'Should update with max value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, max: 100 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          shouldContainResult: {
            value: 100,
          },
        },
        {
          name: 'Should update with min value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, min: 200 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          shouldContainResult: {
            value: 200,
          },
        },
      ].forEach((scenario) => runFieldChangeScenario(scenario));
    });

    [
      {
        name: 'Should update string value',
        elements: [{ id: 'number', type: FormElementType.STRING }],
        getField: selectors.fieldString,
        newValue: '123',
        shouldContainResult: {
          value: '123',
        },
      },
      {
        name: 'Should update password value',
        elements: [{ id: 'number', type: FormElementType.PASSWORD }],
        getField: selectors.fieldPassword,
        newValue: '123',
        shouldContainResult: {
          value: '123',
        },
      },
      {
        name: 'Should update textarea value',
        elements: [{ id: 'number', type: FormElementType.TEXTAREA }],
        getField: selectors.fieldTextarea,
        newValue: '123',
        shouldContainResult: {
          value: '123',
        },
      },
      {
        name: 'Should update select value',
        elements: [{ id: 'number', type: FormElementType.SELECT, options: [{ value: '123' }] }],
        getField: selectors.fieldSelect,
        newValue: '123',
        shouldContainResult: {
          value: '123',
        },
      },
    ].forEach((scenario) => runFieldChangeScenario(scenario));

    /**
     * Code
     */
    it('Should update code value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.CODE }],
      };
      const onOptionsChange = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onOptionsChange }));

      /**
       * Blur code field
       */
      fireEvent.blur(selectors.fieldCode(), { target: { value: '123' } });

      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: '123',
            }),
          ]),
        })
      );
    });

    /**
     * Boolean
     */
    it('Should update boolean value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.BOOLEAN }],
      };
      const onOptionsChange = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onOptionsChange }));

      /**
       * Click on true option
       */
      const booleanSelectors = getFormElementsSelectors(within(selectors.fieldBooleanContainer()));
      fireEvent.click(booleanSelectors.booleanOption(false, 'true'));

      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: true,
            }),
          ]),
        })
      );
    });

    /**
     * Date Time
     */
    it('Should update dateTime value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.DATETIME, value: '2023-05-31 12:30:30' }],
      };
      const onOptionsChange = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onOptionsChange }));

      /**
       * Change date time
       */
      fireEvent.change(selectors.fieldDateTime(), { target: { value: '2021-07-31 12:30:30' } });
      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: '2021-07-31 12:30:30',
            }),
          ]),
        })
      );
    });

    /**
     * Slider
     */
    it('Should update slider value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.SLIDER, value: 100, min: 1, max: 200 }],
      };
      const onOptionsChange = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onOptionsChange }));

      /**
       * Change slider input value
       */
      fireEvent.change(selectors.fieldSliderInput(), { target: { value: '123' } });
      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: 123,
            }),
          ]),
        })
      );

      /**
       * Change slider value
       */
      fireEvent.change(selectors.fieldSlider(), { target: { value: '150' } });
      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: 150,
            }),
          ]),
        })
      );
    });

    /**
     * Radio
     */
    it('Should update radio value', () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [
          { id: 'number', type: FormElementType.RADIO, options: [{ value: 'optionValue', label: 'Option Label' }] },
        ],
      };
      const onOptionsChange = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onOptionsChange }));

      /**
       * Change date time
       */
      const radioOption = within(selectors.fieldRadioContainer()).getByText('Option Label');
      fireEvent.click(radioOption);
      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              value: 'optionValue',
            }),
          ]),
        })
      );
    });
  });
});
