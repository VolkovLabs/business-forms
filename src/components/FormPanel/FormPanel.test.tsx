import React from 'react';
import { AppEvents } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { PanelContextProvider } from '@grafana/ui';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import {
  ButtonOrientation,
  ButtonVariant,
  FormElementDefault,
  FormElementType,
  LayoutVariant,
  RequestMethod,
} from '../../constants';
import { FormElement } from '../../types';
import { getPanelSelectors } from '../../utils';
import { FormElements } from '../FormElements';
import { FormPanel } from './FormPanel';

/**
 * Mock Form Elements
 */
jest.mock('../FormElements', () => ({
  FormElements: jest.fn().mockImplementation(() => null),
}));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getAppEvents: jest.fn().mockImplementation(() => ({
    publish: jest.fn(),
  })),
}));

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
   * @param props
   * @param options
   */
  const getComponent = ({ props = {}, options = {} } = {}) => {
    const finalOptions: any = {
      submit: {},
      initial: {
        url: 'some-url',
        method: RequestMethod.POST,
        header: [
          {
            name: 'customHeader',
            value: '123',
          },
        ],
      },
      update: {
        url: 'some-url',
        method: RequestMethod.POST,
        header: [
          {
            name: 'customHeader',
            value: '123',
          },
        ],
      },
      reset: {},
      saveDefault: {},
      layout: { variant: LayoutVariant.SINGLE },
      buttonGroup: { orientation: ButtonOrientation.CENTER },
      elements: [{ ...FormElementDefault, id: 'test' }],
      ...options,
    };

    const finalProps: any = {
      eventBus: {
        getStream: jest.fn().mockImplementation(() => ({
          subscribe: jest.fn().mockImplementation(() => ({
            unsubscribe: jest.fn(),
          })),
        })),
      },
      replaceVariables: (code: string) => code,
      onOptionsChange: jest.fn(),
      ...props,
    };

    return <FormPanel {...finalProps} options={finalOptions} />;
  };

  it('Should find component with Elements', async () => {
    await act(() => render(getComponent()));
    expect(selectors.root()).toBeInTheDocument();
  });

  /**
   * Alert
   */
  it('Should find component with Alert message if no elements', async () => {
    await act(() => render(getComponent({ options: { elements: [] } })));
    expect(selectors.infoMessage()).toBeInTheDocument();
  });

  /**
   * Single Layout
   */
  it('Should render single layout', async () => {
    await act(() => render(getComponent()));
    expect(selectors.singleLayoutContent()).toBeInTheDocument();
  });

  /**
   * Split Layout
   */
  it('Should render split layout', async () => {
    await act(() =>
      render(
        getComponent({
          options: {
            layout: {
              variant: LayoutVariant.SPLIT,
              sections: [{ name: 'section1' }, { name: 'section2' }],
            },
          },
        })
      )
    );
    expect(selectors.splitLayoutContent(false, 'section1')).toBeInTheDocument();
    expect(selectors.splitLayoutContent(false, 'section2')).toBeInTheDocument();
  });

  /**
   * Buttons
   */
  it('Should render buttons ', async () => {
    await act(() => render(getComponent()));

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();
  });

  /**
   * Initial Request
   */
  describe('Initial request', () => {
    it('Should make initial request', async () => {
      let fetchCalledOptions: any = {};
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        fetchCalledOptions = options;
        return Promise.resolve({
          json: Promise.resolve({}),
        } as any);
      });

      /**
       * Render
       */
      await act(() =>
        render(
          getComponent({
            props: {},
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'some-url',
        expect.objectContaining({
          method: RequestMethod.POST,
        })
      );
      expect(fetchCalledOptions.headers.get('customHeader')).toEqual('123');
    });

    it('Should show error if initial request failed', async () => {
      jest.mocked(fetch).mockRejectedValueOnce(new Error('message'));

      /**
       * Render
       */
      await act(async () => render(getComponent()));

      /**
       * Check if http error message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: message')).toBeInTheDocument();
    });

    it('Should show error if initial request parameter is not defined', async () => {
      /**
       * Render
       */
      await act(() =>
        render(
          getComponent({
            props: {
              replaceVariables: () => null,
            },
          })
        )
      );

      /**
       * Check if request parameters error message is shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('All request parameters should be defined. Remove empty parameters.')
      ).toBeInTheDocument();
    });

    it('Should show cors error', async () => {
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            type: 'opaque',
          }) as any
      );

      /**
       * Render
       */
      await act(() => render(getComponent()));

      /**
       * Check if cors error message is shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('CORS prevents access to the response for Initial values.')
      ).toBeInTheDocument();
    });
  });

  /**
   * Update request
   */
  describe('Update request', () => {
    it('Should run update request', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );
      const { rerender } = await act(() =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FormElementDefault, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(() =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FormElementDefault, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                updatedOnly: true,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: Record<string, string> = {};
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        requestData = JSON.parse((options?.body as any) || '{}');
        return Promise.resolve({
          ok: true,
          json: jest.fn(() =>
            Promise.resolve({
              test: '123',
            })
          ),
        }) as any;
      });

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(() => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData).toEqual({
        number: 111,
      });
    });

    it('Should show parameters error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(() => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(() =>
        rerender(
          getComponent({
            props: {
              replaceVariables: () => null,
            },
            options: {
              elements: [{ ...FormElementDefault, id: 'test', value: '123' }],
            },
          })
        )
      );

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(() => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('All request parameters should be defined. Remove empty parameters.')
      ).toBeInTheDocument();
    });

    it('Should show http error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(() => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(() =>
        rerender(
          getComponent({
            options: {
              elements: [{ ...FormElementDefault, id: 'test', value: '123' }],
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockRejectedValueOnce(new Error('message'));

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: message')).toBeInTheDocument();
    });

    it('Should run update request after update confirmation', async () => {
      /**
       * Render
       */
      jest.mocked(fetch).mockImplementationOnce(
        () =>
          Promise.resolve({
            ok: true,
            json: jest.fn(() =>
              Promise.resolve({
                test: '123',
                number: 123,
              })
            ),
          }) as any
      );
      const { rerender } = await act(() =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FormElementDefault, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
              update: {
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(() =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FormElementDefault, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                updatedOnly: true,
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: Record<string, string> = {};
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        requestData = JSON.parse((options?.body as any) || '{}');
        return Promise.resolve({
          ok: true,
          json: jest.fn(() =>
            Promise.resolve({
              test: '123',
            })
          ),
        }) as any;
      });

      /**
       * Check if Update can be run
       */
      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Run update confirmation
       */
      await act(() => {
        fireEvent.click(selectors.buttonSubmit());
      });

      /**
       * Confirm update
       */
      expect(selectors.buttonConfirmUpdate()).toBeInTheDocument();
      await act(() => {
        fireEvent.click(selectors.buttonConfirmUpdate());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData).toEqual({
        number: 111,
      });
    });
  });

  /**
   * Code execution
   */
  describe('Code execution', () => {
    it('Should execute code on initial request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);
      const publish = jest.fn();
      jest.mocked(getAppEvents).mockImplementationOnce(
        () =>
          ({
            publish,
          } as any)
      );
      await act(() =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: 'notifySuccess("success"); notifyError("error");',
              },
            },
          })
        )
      );

      expect(replaceVariables).toHaveBeenCalledWith('notifySuccess("success"); notifyError("error");');
      expect(publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
    });

    it('Should execute code on update request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);
      const publish = jest.fn();
      jest.mocked(getAppEvents).mockImplementation(
        () =>
          ({
            publish,
          } as any)
      );
      const defaultOptions = {
        initial: {},
        update: {
          method: RequestMethod.NONE,
          code: 'notifySuccess("success"); notifyError("error");',
        },
      };
      const { rerender } = await act(() =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(() =>
        rerender(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              ...defaultOptions,
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
            },
          })
        )
      );

      jest.mocked(replaceVariables).mockClear();
      jest.mocked(publish).mockClear();

      expect(selectors.buttonSubmit()).not.toBeDisabled();
      await act(() => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(replaceVariables).toHaveBeenCalledWith(defaultOptions.update.code);
      expect(publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });

      jest.mocked(getAppEvents).mockClear();
    });
  });

  describe('Confirm changes', () => {
    const prepareComponent = async () => {
      let triggerChangeElement: (element: FormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = { ...FormElementDefault, id: 'test', title: 'Field', value: '123' };
      const elementWithInitialValue = { ...FormElementDefault, id: 'string', title: 'Field 2', value: '' };
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(() =>
        render(
          getComponent({
            options: { elements: [elementWithInitialValue, elementWithoutInitialValue], update: { confirm: true } },
          })
        )
      );

      return {
        triggerChangeElement,
        elementWithoutInitialValue,
        elementWithInitialValue,
        initialValues,
      };
    };

    afterAll(() => {
      jest.mocked(FormElements).mockReset();
    });

    it('Should show changed values if field has initial value', async () => {
      const { triggerChangeElement, elementWithInitialValue, initialValues } = await prepareComponent();

      /**
       * Trigger field change
       */
      await act(() =>
        triggerChangeElement({
          ...elementWithInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(() => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check updated field presence in confirm modal
       */
      const updatedField = selectors.confirmModalField(false, elementWithInitialValue.id);
      expect(updatedField).toBeInTheDocument();

      /**
       * Check correct data is shown for updated field
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle()).toHaveTextContent(elementWithInitialValue.title);
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue()).toHaveTextContent(
        initialValues[elementWithInitialValue.id]
      );
      expect(updatedFieldSelectors.confirmModalFieldValue()).toHaveTextContent('111');
    });

    it('Should show changed values if field does not have initial value', async () => {
      const { triggerChangeElement, elementWithoutInitialValue } = await prepareComponent();

      /**
       * Trigger field change
       */
      await act(() =>
        triggerChangeElement({
          ...elementWithoutInitialValue,
          value: '111',
        })
      );

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(() => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check updated field presence in confirm modal
       */
      const updatedField = selectors.confirmModalField(false, elementWithoutInitialValue.id);
      expect(updatedField).toBeInTheDocument();

      /**
       * Check correct data is shown for updated field
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle()).toHaveTextContent(elementWithoutInitialValue.title);
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue()).toHaveTextContent(
        elementWithoutInitialValue.value
      );
      expect(updatedFieldSelectors.confirmModalFieldValue()).toHaveTextContent('111');
    });
  });

  describe('Save default values', () => {
    it('Should update options', async () => {
      const onOptionsChange = jest.fn();
      let triggerChangeElement: (element: FormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = { ...FormElementDefault, id: 'test', title: 'Field', value: '123' };
      const elementWithInitialValue = { ...FormElementDefault, id: 'string', title: 'Field 2', value: '' };
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(() =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => true } as any}>
            {getComponent({
              props: {
                onOptionsChange,
              },
              options: {
                elements: [elementWithInitialValue, elementWithoutInitialValue],
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
              },
            })}
          </PanelContextProvider>
        )
      );

      await act(() =>
        triggerChangeElement({
          ...elementWithoutInitialValue,
          value: '111',
        })
      );

      expect(selectors.buttonSaveDefault()).toBeInTheDocument();

      expect(onOptionsChange).not.toHaveBeenCalled();

      /**
       * Save Default values
       */
      await act(() => fireEvent.click(selectors.buttonSaveDefault()));

      expect(onOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: elementWithoutInitialValue.id,
              value: '111',
            }),
            expect.objectContaining({
              id: elementWithInitialValue.id,
              value: initialValues[elementWithInitialValue.id],
            }),
          ]),
        })
      );
    });

    it('Should not show save default button if can not update dashboard', async () => {
      await act(() =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => false } as any}>
            {getComponent({
              options: {
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
              },
            })}
          </PanelContextProvider>
        )
      );

      expect(selectors.buttonSaveDefault(true)).not.toBeInTheDocument();
    });
  });
});
