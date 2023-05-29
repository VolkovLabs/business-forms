import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
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
        aria-label={restProps['aria-label']}
        value={restProps.value}
        onChange={(event) => {
          if (onBlur) {
            onBlur(event.target.value);
          }
        }}
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
        value={restProps.value}
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
  jest.fn().mockImplementation(({ onChange, ariaLabelForHandle, value }) => {
    return (
      <input
        type="number"
        onChange={(event) => {
          if (onChange) {
            onChange(Number(event.target.value));
          }
        }}
        aria-label={ariaLabelForHandle}
        value={value}
      />
    );
  })
);

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Form Elements
 */
describe('Form Elements', () => {
  const onChangeElement = jest.fn();
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
    return <FormElements options={options} elements={options.elements} {...restProps} />;
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

      render(getComponent({ options, onChangeElement }));
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

    render(getComponent({ options, onChangeElement }));
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

    render(getComponent({ options, onChangeElement }));

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
      elements: [{ id: 'select', type: FormElementType.SELECT, value: '123' }],
    };

    render(getComponent({ options, onChangeElement }));

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

    render(getComponent({ options, onChangeElement }));

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

    render(getComponent({ options, onChangeElement, section: { name: 'left' } }));
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
      expectedValue,
    }: {
      name: string;
      getField: () => HTMLElement;
      newValue: string;
      elements?: any[];
      expectedValue: any;
    }) => {
      it(name, async () => {
        let appliedElements = elements;
        const options = {
          submit: {},
          initial: { highlightColor: false },
          update: {},
          reset: {},
          elements: appliedElements,
        };
        const onChangeElement = jest.fn(
          (updatedElement) =>
            (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
        );

        /**
         * First render
         */
        const { rerender } = render(getComponent({ options, onChangeElement }));

        /**
         * Change field value
         */
        await act(() => fireEvent.change(getField(), { target: { value: newValue } }));

        /**
         * Rerender with updated elements
         */
        await act(() =>
          rerender(
            getComponent({
              options: {
                ...options,
                elements: appliedElements,
              },
              onChangeElement,
            })
          )
        );

        expect(getField()).toHaveValue(expectedValue);
      });
    };

    /**
     * Number
     */
    describe('Number Field', () => {
      [
        {
          name: 'Should update value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 123,
        },
        {
          name: 'Should update with max value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, max: 100, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 100,
        },
        {
          name: 'Should update with min value',
          elements: [{ id: 'number', type: FormElementType.NUMBER, min: 200, value: 0 }],
          getField: selectors.fieldNumber,
          newValue: '123',
          expectedValue: 200,
        },
      ].forEach((scenario) => runFieldChangeScenario(scenario));
    });

    [
      {
        name: 'Should update string value',
        elements: [{ id: 'number', type: FormElementType.STRING, value: '' }],
        getField: selectors.fieldString,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update password value',
        elements: [{ id: 'number', type: FormElementType.PASSWORD, value: '' }],
        getField: selectors.fieldPassword,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update textarea value',
        elements: [{ id: 'number', type: FormElementType.TEXTAREA, value: '' }],
        getField: selectors.fieldTextarea,
        newValue: '123',
        expectedValue: '123',
      },
      {
        name: 'Should update select value',
        elements: [
          { id: 'number', type: FormElementType.SELECT, value: '111', options: [{ value: '111' }, { value: '123' }] },
        ],
        getField: selectors.fieldSelect,
        newValue: '123',
        expectedValue: '123',
      },
    ].forEach((scenario) => runFieldChangeScenario(scenario));

    /**
     * Code
     */
    it('Should update code value', async () => {
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: [{ id: 'number', type: FormElementType.CODE, value: '111' }],
      };
      const onChangeElement = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onChangeElement }));

      /**
       * Blur code field
       */
      await act(() => fireEvent.blur(selectors.fieldCode(), { target: { value: '123' } }));

      expect(selectors.fieldCode()).toHaveValue('123');
    });

    /**
     * Boolean
     */
    it('Should update boolean value', async () => {
      let appliedElements = [{ id: 'number', type: FormElementType.BOOLEAN }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Click on true option
       */
      const booleanSelectors = getFormElementsSelectors(within(selectors.fieldBooleanContainer()));
      await act(() => fireEvent.click(booleanSelectors.booleanOption(false, 'true')));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(booleanSelectors.booleanOption(false, 'true')).toBeChecked();
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
      const onChangeElement = jest.fn();

      /**
       * Render Component
       */
      render(getComponent({ options, onChangeElement }));

      /**
       * Change date time
       */
      fireEvent.change(selectors.fieldDateTime(), { target: { value: '2021-07-31 12:30:30' } });

      expect(selectors.fieldDateTime()).toHaveValue('2021-07-31 12:30:30');
    });

    /**
     * Slider
     */
    it('Should update slider value', async () => {
      let appliedElements = [{ id: 'number', type: FormElementType.SLIDER, value: 100, min: 1, max: 200 }];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Change slider input value
       */
      await act(() => fireEvent.change(selectors.fieldSliderInput(), { target: { value: '123' } }));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(selectors.fieldSliderInput()).toHaveValue(123);

      /**
       * Change slider value
       */
      await act(() => fireEvent.change(selectors.fieldSlider(), { target: { value: '150' } }));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      expect(selectors.fieldSlider()).toHaveValue(150);
    });

    /**
     * Radio
     */
    it('Should update radio value', async () => {
      const elementOption = { value: 'optionValue', label: 'Option Label' };
      const element = { id: 'number', type: FormElementType.RADIO, options: [elementOption] };
      let appliedElements = [element];
      const options = {
        submit: {},
        initial: { highlightColor: false },
        update: {},
        reset: {},
        elements: appliedElements,
      };
      const onChangeElement = jest.fn(
        (updatedElement) =>
          (appliedElements = appliedElements.map((item) => (item.id === updatedElement.id ? updatedElement : item)))
      );

      /**
       * Render Component
       */
      const { container, rerender } = render(getComponent({ options, onChangeElement }));

      /**
       * Check option
       */
      const radioGroupContainer = within(selectors.fieldRadioContainer());

      await act(() => fireEvent.click(radioGroupContainer.getByText(elementOption.label)));

      await act(() =>
        rerender(
          getComponent({
            options: {
              ...options,
              elements: appliedElements,
            },
            onChangeElement,
          })
        )
      );

      /**
       * Use native querySelector due to impossible to set aria-label because dynamic options
       */
      const radioLabel = radioGroupContainer.getByText(elementOption.label);
      const radioInput = container.querySelector(`#${radioLabel.getAttribute('for')}`);

      expect(radioInput).toBeInTheDocument();
      expect(radioInput).toBeChecked();
    });
  });

  it('Should update local elements if prop elements is changed', async () => {
    const element = { id: 'number', type: FormElementType.STRING, value: '123' };
    const options = {
      submit: {},
      initial: { highlightColor: false },
      update: {},
      reset: {},
      elements: [element],
    };

    const { rerender } = render(getComponent({ options, onChangeElement }));

    /**
     * Check element presence
     */
    expect(selectors.element(false, element.id, element.type)).toBeInTheDocument();

    /**
     * Rerender with new elements
     */
    const updatedElement = {
      ...element,
      type: FormElementType.NUMBER,
    };

    await act(() =>
      rerender(
        getComponent({
          options: {
            ...options,
            elements: [updatedElement],
          },
          onChangeElement,
        })
      )
    );

    /**
     * Check if only updated elements is rendered
     */
    expect(selectors.element(true, element.id, element.type)).not.toBeInTheDocument();
    expect(selectors.element(false, updatedElement.id, updatedElement.type)).toBeInTheDocument();
  });
});
