import { AppEvents, EventBusSrv, FieldType, LoadingState, toDataFrame } from '@grafana/data';
import { getAppEvents, RefreshEvent } from '@grafana/runtime';
import { sceneGraph } from '@grafana/scenes';
import { PanelContextProvider } from '@grafana/ui';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useDashboardRefresh, useDatasourceRequest } from '@volkovlabs/components';
import React, { ReactElement } from 'react';

import {
  CONFIRM_MODAL_DEFAULT,
  ContentType,
  FORM_ELEMENT_DEFAULT,
  LayoutOrientation,
  LayoutVariant,
  PayloadMode,
  RequestMethod,
  ResetActionMode,
  SectionVariant,
  TEST_IDS,
} from '@/constants';
import {
  ButtonOrientation,
  ButtonVariant,
  CustomButtonShow,
  FormElement,
  FormElementType,
  LocalFormElement,
  ModalColumnName,
  PanelOptions,
  UpdateEnabledMode,
} from '@/types';
import {
  getFormElementsSectionSelectors,
  getFormElementsSelectors,
  getPanelSelectors,
  toLocalFormElement,
} from '@/utils';

import { FormElements } from '../FormElements';
import { FormPanel } from './FormPanel';

/**
 * Mock Form Elements
 */
jest.mock('../FormElements', () => ({
  FormElements: jest.fn(jest.requireActual('../FormElements').FormElements),
}));

/**
 * Mock @grafana/runtime
 */
const appEventsMock = {
  publish: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getAppEvents: jest.fn(() => appEventsMock),
}));

/**
 * Mock hooks
 */
const datasourceRequestMock = jest.fn(() =>
  Promise.resolve({
    data: [],
    state: LoadingState.Done,
  })
);

const mockPublish = jest.fn();
const mockRefreshDashboard = jest.fn(() => {
  mockPublish({
    payload: {
      refreshAll: true,
    },
    type: 'variables-changed',
  });
});

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Panel Selectors
   */
  const selectors = getPanelSelectors(screen);

  /**
   * Elements Selectors
   */
  const elementsSelectors = getFormElementsSelectors(screen);

  /**
   * Section Selectors
   */
  const sectionSelectors = getFormElementsSectionSelectors(screen);

  /**
   * Replace variables
   */
  const replaceVariablesMock = (code: string) => code;
  const replaceVariables = jest.fn(replaceVariablesMock);

  /**
   * Get Tested Component
   * @param props
   * @param options
   */
  const getComponent = ({ props = {}, options = {} } = {}) => {
    const finalOptions: any = {
      sync: true,
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
      updateEnabled: UpdateEnabledMode.AUTO,
      reset: {},
      saveDefault: {},
      layout: { variant: LayoutVariant.SINGLE },
      buttonGroup: { orientation: ButtonOrientation.CENTER },
      elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test' }],
      confirmModal: CONFIRM_MODAL_DEFAULT,
      resetAction: {},
      ...options,
    };

    const finalProps: any = {
      data: {
        state: LoadingState.Done,
      },
      eventBus: {
        getStream: jest.fn().mockImplementation(() => ({
          subscribe: jest.fn().mockImplementation(() => ({
            unsubscribe: jest.fn(),
          })),
        })),
      },
      replaceVariables,
      onOptionsChange: jest.fn(),
      ...props,
    };

    return <FormPanel {...finalProps} options={finalOptions} />;
  };

  beforeEach(() => {
    /**
     * Use datasource request
     */
    jest.mocked(useDatasourceRequest).mockReset();
    jest.mocked(useDatasourceRequest).mockReturnValue(datasourceRequestMock as any);

    jest.mocked(useDashboardRefresh).mockReset();
    jest.mocked(useDashboardRefresh).mockReturnValue(mockRefreshDashboard);

    jest.mocked(FormElements).mockClear();
    jest.mocked(FormElements).mockImplementation(jest.requireActual('../FormElements').FormElements);
    jest.mocked(fetch).mockClear();
    replaceVariables.mockClear();
    replaceVariables.mockImplementation(replaceVariablesMock);

    /**
     * App Events
     */
    jest.mocked(getAppEvents).mockReset();
    jest.mocked(getAppEvents).mockReturnValue(appEventsMock as any);
    appEventsMock.publish.mockReset();

    /**
     * delete __grafanaSceneContext
     */
    delete window.__grafanaSceneContext;
  });

  it('Should find component with Elements', async () => {
    await act(async () => render(getComponent()));
    expect(selectors.root()).toBeInTheDocument();
  });

  /**
   * Alert
   */
  it('Should find component with Alert message if no elements', async () => {
    await act(async () => render(getComponent({ options: { elements: [] } })));
    expect(selectors.infoMessage()).toBeInTheDocument();
  });

  /**
   * Single Layout
   */
  it('Should render single layout', async () => {
    await act(async () => render(getComponent()));
    expect(selectors.singleLayoutContent()).toBeInTheDocument();
  });

  /**
   * Split Layout
   */
  it('Should render split layout', async () => {
    await act(async () =>
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
   * Split Vertical Layout
   */
  it('Should render split vertical layout', async () => {
    await act(async () =>
      render(
        getComponent({
          options: {
            layout: {
              variant: LayoutVariant.SPLIT,
              orientation: LayoutOrientation.VERTICAL,
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
   * Split Vertical Layout with collapsable
   */
  it('Should render split vertical layout with collapsable', async () => {
    await act(async () =>
      render(
        getComponent({
          options: {
            elements: [{ ...FORM_ELEMENT_DEFAULT, section: 'section1', id: 'test' }],
            layout: {
              variant: LayoutVariant.SPLIT,
              orientation: LayoutOrientation.VERTICAL,
              sectionVariant: SectionVariant.COLLAPSABLE,
              sections: [
                { name: 'section1', id: 'section1' },
                { name: 'section2', id: 'section2' },
              ],
            },
          },
        })
      )
    );

    expect(selectors.splitLayoutContent(false, 'section1')).toBeInTheDocument();
    expect(selectors.splitLayoutContent(false, 'section2')).toBeInTheDocument();

    expect(sectionSelectors.sectionHeader(true, 'section1', 'section1')).toBeInTheDocument();
  });

  /**
   * Buttons
   */
  it('Should render buttons ', async () => {
    await act(async () => render(getComponent()));

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();
  });

  it('Should render custom buttons after form buttons ', async () => {
    /**
     * Render
     */
    const replaceVariables = jest.fn((code) => code);

    await act(async () =>
      render(
        getComponent({
          props: {
            replaceVariables,
          },
          options: {
            initial: {
              method: RequestMethod.NONE,
            },
            elements: [
              { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
              { type: FormElementType.NUMBER, id: 'number', value: 111, unit: 'test' },
              { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              { type: FormElementType.STRING, id: 'string1', value: 'str1' },
              { type: FormElementType.STRING, id: 'string2', value: 'str2' },
              {
                type: FormElementType.BUTTON,
                id: 'button1',
                value: '',
                customCode: `context.grafana.notifySuccess("success");`,
                title: 'Custom Button',
                buttonLabel: 'Test 1',
                show: CustomButtonShow.BOTTOM,
                unit: 'test 2',
                foregroundColor: 'red',
                backgroundColor: '#3274D9',
                variant: ButtonVariant.PRIMARY,
              },
            ],
          },
        })
      )
    );

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButtonContainer(true)).not.toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toBeInTheDocument();
  });
  it('Should render custom buttons after form buttons and execute code', async () => {
    /**
     * Render
     */
    const replaceVariables = jest.fn((code) => code);

    await act(async () =>
      render(
        getComponent({
          props: {
            replaceVariables,
          },
          options: {
            initial: {
              method: RequestMethod.NONE,
            },
            elements: [
              { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
              { type: FormElementType.NUMBER, id: 'number', value: 111, unit: 'test' },
              { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              { type: FormElementType.STRING, id: 'string1', value: 'str1' },
              { type: FormElementType.STRING, id: 'string2', value: 'str2' },
              {
                type: FormElementType.BUTTON,
                id: 'button1',
                value: '',
                customCode: `context.grafana.notifySuccess("success");`,
                title: 'Custom Button',
                buttonLabel: 'Test 1',
                show: CustomButtonShow.BOTTOM,
                unit: 'test 2',
                foregroundColor: 'red',
                backgroundColor: '#3274D9',
                variant: ButtonVariant.CUSTOM,
              },
            ],
          },
        })
      )
    );

    expect(selectors.buttonSubmit()).toBeInTheDocument();
    expect(selectors.buttonReset()).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButtonContainer(true)).not.toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toBeInTheDocument();

    expect(elementsSelectors.fieldCustomButton(false, 'button1')).toHaveStyle({
      'background-color': 'rgb(50, 116, 217)',
    });

    /**
     * Run Execute code
     */
    await act(async () => {
      fireEvent.click(elementsSelectors.fieldCustomButton(false, 'button1'));
    });

    expect(replaceVariables).toHaveBeenCalledWith('context.grafana.notifySuccess("success");');
    expect(appEventsMock.publish).toHaveBeenCalledWith({
      type: AppEvents.alertSuccess.name,
      payload: 'success',
    });
  });

  /**
   * Initial Request
   */
  describe('Initial request', () => {
    it('Should make initial request once', async () => {
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
      await act(async () =>
        render(
          getComponent({
            props: {},
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'some-url',
        expect.objectContaining({
          method: RequestMethod.POST,
        })
      );
      expect(fetchCalledOptions.headers.get('customHeader')).toEqual('123');
    });

    it('Should handle AbortError and return null', async () => {
      /**
       * Mock fetch to throw AbortError
       */
      const abortError = new Error('Request was aborted');
      abortError.name = 'AbortError';
      jest.mocked(fetch).mockRejectedValueOnce(abortError);

      /**
       * Render
       */
      await act(async () => render(getComponent()));

      /**
       * Check that no error message is shown (because we return null on AbortError)
       */
      expect(selectors.errorMessage(true)).not.toBeInTheDocument();
    });

    it('Should ignore response if request id is outdated (race condition)', async () => {
      /**
       * Track fetch calls and their responses
       */
      let resolveFirstFetch: (value: any) => void;
      let resolveSecondFetch: (value: any) => void;

      const firstFetchPromise = new Promise((resolve) => {
        resolveFirstFetch = resolve;
      });

      const secondFetchPromise = new Promise((resolve) => {
        resolveSecondFetch = resolve;
      });

      let fetchCallCount = 0;
      jest.mocked(fetch).mockImplementation(() => {
        fetchCallCount++;
        if (fetchCallCount === 1) {
          return firstFetchPromise as any;
        }
        return secondFetchPromise as any;
      });

      /**
       * Render component which triggers initial request
       */
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              sync: true,
            },
          })
        )
      );

      /**
       * Verify first fetch was called
       */
      expect(fetch).toHaveBeenCalledTimes(1);

      /**
       * Trigger second request by rerendering (simulating data change)
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              sync: true,
            },
          })
        )
      );

      /**
       * Verify second fetch was called
       */
      expect(fetch).toHaveBeenCalledTimes(2);

      /**
       * Resolve second (newer) request first
       */
      await act(async () => {
        resolveSecondFetch({
          ok: true,
          json: () => Promise.resolve({ test: 'second-response' }),
        });
      });

      /**
       * Now resolve first (older) request
       */
      await act(async () => {
        resolveFirstFetch({
          ok: true,
          json: () => Promise.resolve({ test: 'first-response' }),
        });
      });

      /**
       * Wait for all promises to settle
       */
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      /**
       * Verify that only the second response was processed
       * We can check this by ensuring no error was set and the component is in correct state
       * The first response should be ignored due to outdated requestId
       */
      expect(selectors.errorMessage(true)).not.toBeInTheDocument();
      expect(selectors.loadingBar(true)).not.toBeInTheDocument();
    });

    /**
     * Sections helper
     */
    describe('Sections helper', () => {
      it('Should add section from the initial code', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.add({name:'Section 2', id:'section2'});
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(selectors.splitLayoutContent(false, 'Section 2')).toBeInTheDocument();
      });

      it('Should add section from the initial code with elements', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.add({name:'Section 2', id:'section2', elements:['test']});
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(selectors.splitLayoutContent(false, 'Section 2')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section2', 'Section 2')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section2', 'Section 2'));
        expect(elementsSelectors.element(false, 'test', FormElementType.STRING)).toBeInTheDocument();
      });

      it('Should add section from the initial code and not include element if id`s not present in elements', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.add({name:'Section 2', id:'section2', elements:['test-2']});
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(selectors.splitLayoutContent(false, 'Section 2')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section2', 'Section 2')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section2', 'Section 2'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();
      });

      it('Should assign element if section present', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.assign('section1', ['test']);
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section1', 'Section 1')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'Section 1'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).toBeInTheDocument();
      });

      it('Should not assign element if section not present', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.assign('section12', ['test']);
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section1', 'Section 1')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'Section 1'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();
      });

      it('Should not assign not existed elements', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.assign('section1', ['test15']);
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section1', 'Section 1')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'Section 1'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test15', FormElementType.STRING)).not.toBeInTheDocument();
      });

      it('Should unassign element from section', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.unassign(['test']);
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    section: 'section1',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section1', 'Section 1')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'Section 1'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();
      });

      it('Should no unassign wrong element from section', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.unassign(['test11']);
                  `,
                },
                elements: [
                  {
                    ...FORM_ELEMENT_DEFAULT,
                    id: 'test',
                    section: 'section1',
                    queryField: undefined,
                  },
                ],
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.COLLAPSABLE,
                  sections: [section],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, 'Section 1')).toBeInTheDocument();
        expect(sectionSelectors.sectionHeader(false, 'section1', 'Section 1')).toBeInTheDocument();
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).not.toBeInTheDocument();

        fireEvent.click(sectionSelectors.sectionHeader(true, 'section1', 'Section 1'));
        expect(elementsSelectors.element(true, 'test', FormElementType.STRING)).toBeInTheDocument();
      });

      it('Should remove section from the initial code', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };
        const section2 = { id: 'section2', name: 'Section 2', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.remove('section2');
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.DEFAULT,
                  sections: [section, section2],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(false, section.name)).toBeInTheDocument();
        expect(selectors.splitLayoutContent(true, section2.name)).not.toBeInTheDocument();
      });

      it('Should change sections from the initial code', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };
        const section2 = { id: 'section2', name: 'Section 2', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    context.panel.sectionsUtils.update([{name:'Section 3', id:'section3'}]);
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.DEFAULT,
                  sections: [section, section2],
                },
              },
            })
          )
        );

        expect(selectors.splitLayoutContent(true, section.name)).not.toBeInTheDocument();
        expect(selectors.splitLayoutContent(true, section2.name)).not.toBeInTheDocument();
        expect(selectors.splitLayoutContent(true, 'Section 3')).toBeInTheDocument();
      });

      it('Should call getAll from sections and return correct data', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };
        const section2 = { id: 'section2', name: 'Section 2', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    const sections = context.panel.sectionsUtils.getAll(); const sectionsIds = sections.map(element => element.id).join(); context.grafana.notifySuccess(['Sections',sectionsIds]);
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.DEFAULT,
                  sections: [section, section2],
                },
              },
            })
          )
        );

        expect(appEventsMock.publish).toHaveBeenCalledWith({
          type: AppEvents.alertSuccess.name,
          payload: ['Sections', 'section1,section2'],
        });
      });

      it('Should call get from sections and return correct data', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };
        const section2 = { id: 'section2', name: 'Section 2', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    const section = context.panel.sectionsUtils.get('section1'); context.grafana.notifySuccess(['Sections',section.id]);
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.DEFAULT,
                  sections: [section, section2],
                },
              },
            })
          )
        );

        expect(appEventsMock.publish).toHaveBeenCalledWith({
          type: AppEvents.alertSuccess.name,
          payload: ['Sections', 'section1'],
        });
      });

      it('Should call get from sections and return correct data if section not found', async () => {
        /**
         * Render
         */
        const replaceVariables = jest.fn((code) => code);

        const section = { id: 'section1', name: 'Section 1', expanded: false };
        const section2 = { id: 'section2', name: 'Section 2', expanded: false };

        await act(async () =>
          render(
            getComponent({
              props: {
                replaceVariables,
              },
              options: {
                sync: false,
                initial: {
                  method: RequestMethod.NONE,
                  code: `
                    const section = context.panel.sectionsUtils.get('section12'); context.grafana.notifySuccess(['Sections', section]);
                  `,
                },
                layout: {
                  variant: LayoutVariant.SPLIT,
                  orientation: LayoutOrientation.VERTICAL,
                  sectionVariant: SectionVariant.DEFAULT,
                  sections: [section, section2],
                },
              },
            })
          )
        );

        expect(appEventsMock.publish).toHaveBeenCalledWith({
          type: AppEvents.alertSuccess.name,
          payload: ['Sections', undefined],
        });
      });
    });

    it('Should make initial request once if sync disabled', async () => {
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
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              sync: false,
            },
          })
        )
      );

      rerender(
        getComponent({
          options: {
            sync: false,
          },
        })
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);
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
      expect(selectors.errorMessage()).toHaveTextContent('Initial Error: message');
    });

    it('Should show error if error while execution', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `throw new Error('execution error')`,
              },
            },
            props: {},
          })
        )
      );

      /**
       * Check if execution error message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Error: execution error')).toBeInTheDocument();
    });

    it('Should make initial datasource request', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
            props: {},
          })
        )
      );

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: '123',
        payload: { key1: 'value' },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });

      /**
       * Check if replace variables called for get payload function
       * replaceVariables called for buttons titles, labels, section labels
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(16);
    });

    it('Should make initial datasource request for streaming data state', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
            props: {
              data: {
                state: LoadingState.Streaming,
              },
            },
          })
        )
      );

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: '123',
        payload: { key1: 'value' },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });

      /**
       * Check if replace variables called for get payload function
       * replaceVariables called for buttons titles, labels, section labels
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(16);
    });

    it('Should not make initial datasource request for loading data state', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
            props: {
              data: {
                state: LoadingState.Loading,
              },
            },
          })
        )
      );

      expect(datasourceRequestMock).not.toHaveBeenCalled();
    });

    it('Should make initial datasource request (response doesn`t return state property)', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
            props: {},
          })
        )
      );

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: '123',
        payload: { key1: 'value' },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });
    });

    it('Should update elements with query result', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  queryField: {
                    refId: 'A',
                    value: 'metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: {
                state: LoadingState.Done,
                series: [
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricA1', 'metricA2'],
                      },
                    ],
                    refId: 'A',
                  }),
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricB1', 'metricB2'],
                      },
                    ],
                    refId: 'B',
                  }),
                ],
              },
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: 'metricA2',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should update elements with query result for multiselect elements', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  type: FormElementType.CHECKBOX_LIST,
                  id: 'mapped',
                  queryField: {
                    refId: 'A',
                    value: 'metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: {
                state: LoadingState.Done,
                series: [
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricA1', 'metricA2'],
                      },
                    ],
                    refId: 'A',
                  }),
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricB1', 'metricB2'],
                      },
                    ],
                    refId: 'B',
                  }),
                ],
              },
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: ['metricA1', 'metricA2'],
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should update elements with query result for the same refId', async () => {
      /**
       * Render
       */
      const data = {
        state: LoadingState.Done,
        series: [
          toDataFrame({
            fields: [
              {
                name: 'metric',
                values: ['metricA1', 'metricA2'],
              },
            ],
            name: 'metrics A-1',
            refId: 'A',
          }),
          toDataFrame({
            fields: [
              {
                name: 'metric',
                values: ['metricB1', 'metricB2'],
              },
            ],
            name: 'metrics A-2',
            refId: 'A',
          }),
        ],
      };

      let rerenderCurrent: (ui: ReactElement) => void;

      await act(async () => {
        const { rerender } = render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  type: FormElementType.CHECKBOX_LIST,
                  id: 'mapped',
                  queryField: {
                    refId: 'A',
                    value: 'metrics A-2 metric',
                    label: 'A:metrics A-2 metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: data,
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());

        rerenderCurrent = rerender;
      });

      /**
       * Rerender with other query field
       */
      await act(async () => {
        rerenderCurrent(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  type: FormElementType.CHECKBOX_LIST,
                  id: 'mapped',
                  queryField: {
                    refId: 'A',
                    value: 'metrics A-1 metric',
                    label: 'A:metrics A-1 metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: data,
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenCalledTimes(6);
      /**
       * Check values after render call - 2nd call
       */
      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: ['metricB1', 'metricB2'],
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );

      /**
       * Check values after rerender call - 5th call
       */
      expect(FormElements).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: ['metricA1', 'metricA2'],
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should update elements with query result for the same refId if refId undefined', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  type: FormElementType.CHECKBOX_LIST,
                  id: 'mapped',
                  queryField: {
                    value: 'metrics A-1 metric',
                    label: 'undefined:metrics A-2 metric',
                  },
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryField: undefined,
                },
              ],
            },
            props: {
              data: {
                state: LoadingState.Done,
                series: [
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricA1', 'metricA2'],
                      },
                    ],
                    name: 'metrics A-1',
                  }),
                  toDataFrame({
                    fields: [
                      {
                        name: 'metric',
                        values: ['metricB1', 'metricB2'],
                      },
                    ],
                    name: 'metrics A-2',
                  }),
                ],
              },
            },
          })
        );

        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: ['metricA1', 'metricA2'],
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should not update elements if no query result', async () => {
      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.QUERY,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  queryFieldName: 'metric',
                  value: '123',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  queryFieldName: '',
                },
              ],
            },
            props: {
              data: {
                series: [],
              },
            },
          })
        );
        await waitFor(() => expect(selectors.loadingBar(true)).not.toBeInTheDocument());
      });

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: '123',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should update elements with initial datasource result', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          state: LoadingState.Done,
          data: [
            toDataFrame({
              fields: [
                {
                  name: 'metric',
                  type: FieldType.string,
                  values: ['metric1', 'metric2'],
                },
              ],
            }),
          ],
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  fieldName: 'metric',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  fieldName: '',
                },
              ],
            },
            props: {},
          })
        )
      );

      expect(FormElements).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: 'metric2',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );

      /**
       * Check if replace variables called for get payload function
       * replaceVariables called for buttons titles, labels, section labels
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(19);
    });

    it('Should not update elements if datasource is unspecified', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          state: LoadingState.Done,
          data: [
            toDataFrame({
              fields: [
                {
                  name: 'metric',
                  type: FieldType.string,
                  values: ['metric1', 'metric2'],
                },
              ],
            }),
          ],
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementationOnce(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '',
                getPayload: `return { key1: 'value' }`,
              },
              elements: [
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'mapped',
                  fieldName: 'metric',
                  value: '123',
                },
                {
                  ...FORM_ELEMENT_DEFAULT,
                  id: 'unmapped',
                  fieldName: '',
                },
              ],
            },
            props: {},
          })
        )
      );

      expect(FormElements).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({
              id: 'mapped',
              value: '123',
            }),
            expect.objectContaining({
              id: 'unmapped',
              value: '',
            }),
          ]),
        }),
        expect.anything()
      );
    });

    it('Should show initial datasource request error', async () => {
      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      /**
       * Render
       */
      await act(async () => {
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.DATASOURCE,
                datasource: '123',
                getPayload: `return { key1: 'value' }`,
              },
            },
            props: {},
          })
        );
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should show error if initial request parameter is not defined', async () => {
      /**
       * Render
       */
      await act(async () =>
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
      await act(async () => render(getComponent()));

      /**
       * Check if cors error message is shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('CORS prevents access to the response for Initial values.')
      ).toBeInTheDocument();
    });

    it('Should make initial request on data change', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              data: {
                state: LoadingState.Done,
              },
            },
          })
        )
      );

      /**
       * Check if fetch is called
       */
      expect(fetch).toHaveBeenCalledTimes(1);

      await act(async () =>
        rerender(
          getComponent({
            props: {
              data: {
                state: LoadingState.Done,
              },
            },
          })
        )
      );

      /**
       * Check if fetch is called again
       */
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('Should enable submit from code', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.enableSubmit()`,
              },
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should disable submit from code', async () => {
      /**
       * Render
       */
      await act(async () =>
        render(
          getComponent({
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.disableSubmit()`,
              },
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeDisabled();
    });

    describe('Dashboard Refresh', () => {
      /**
       * Event Bus
       */
      const eventBus = new EventBusSrv();

      it('Should make initial request on dashboard refresh', async () => {
        const data = {
          state: LoadingState.Done,
        };

        /**
         * Render
         */
        await act(async () =>
          render(
            getComponent({
              props: {
                data,
                eventBus,
              },
            })
          )
        );

        /**
         * Check if fetch is called
         */
        expect(fetch).toHaveBeenCalledTimes(1);

        /**
         * Simulate Dashboard Refresh
         */
        await act(async () => {
          eventBus.publish(new RefreshEvent());
        });

        /**
         * Check if fetch is called again
         */
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it('Should not make initial request on dashboard refresh if sync disabled', async () => {
        const data = {
          state: LoadingState.Done,
        };

        /**
         * Render
         */
        await act(async () =>
          render(
            getComponent({
              props: {
                data,
                eventBus,
              },
              options: {
                sync: false,
              },
            })
          )
        );

        /**
         * Check if fetch is called
         */
        expect(fetch).toHaveBeenCalledTimes(1);

        /**
         * Simulate Dashboard Refresh
         */
        await act(async () => {
          eventBus.publish(new RefreshEvent());
        });

        /**
         * Check if fetch is not called again
         */
        expect(fetch).toHaveBeenCalledTimes(1);
      });
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
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
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
      await act(async () => {
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

    it('Should run update request with form data', async () => {
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
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
                contentType: ContentType.FORMDATA,
              },
            },
          })
        )
      );

      /**
       * Clear fetch mock
       */
      let requestData: FormData | any = undefined;
      jest.mocked(fetch).mockClear();
      jest.mocked(fetch).mockImplementationOnce((url, options) => {
        if (options?.body instanceof FormData) {
          requestData = options.body;
        }
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
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(fetch).toHaveBeenCalledWith(
        'update-url',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );

      /**
       * Check if only updated elements are sent
       */
      expect(requestData.get('number')).toEqual('111');
    });

    it('Should show parameters error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            props: {
              replaceVariables: () => null,
            },
            options: {
              elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' }],
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
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(
        within(selectors.errorMessage()).getByText('All request parameters should be defined. Remove empty parameters.')
      ).toBeInTheDocument();
    });

    it('Should run update datasource request', async () => {
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

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                datasource: 'abc',
                method: RequestMethod.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
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
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: 'abc',
        payload: {
          key1: 'value',
        },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });
    });

    it('Should show update datasource request error', async () => {
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

      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                datasource: 'abc',
                method: RequestMethod.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
              },
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
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should show http error', async () => {
      /**
       * Render
       */
      const { rerender } = await act(async () => render(getComponent()));

      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [{ ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' }],
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
      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
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
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              update: {
                url: 'update-url',
                method: RequestMethod.POST,
                payloadMode: PayloadMode.UPDATED,
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
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      /**
       * Confirm update
       */
      expect(selectors.buttonConfirmUpdate()).toBeInTheDocument();
      await act(async () => {
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

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: 'context.grafana.notifySuccess("success"); context.grafana.notifyError("error"); context.grafana.notifyWarning("warning");',
              },
            },
          })
        )
      );

      expect(replaceVariables).toHaveBeenCalledWith(
        'context.grafana.notifySuccess("success"); context.grafana.notifyError("error"); context.grafana.notifyWarning("warning");'
      );
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertWarning.name,
        payload: 'warning',
      });
    });

    it('Should execute code on initial request with patchFormValue correctly', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.patchFormValue({ test2: '15' });`,
              },
            },
          })
        )
      );
      expect(replaceVariables).toHaveBeenCalledWith(`context.panel.patchFormValue({ test2: '15' });`);

      expect(elementsSelectors.fieldNumber()).toBeInTheDocument();
      expect(elementsSelectors.fieldNumber()).toHaveValue(15);
    });

    it('Should execute code on initial request with setFormValue correctly', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              elements: [
                { id: 'test', type: FormElementType.STRING, value: '111' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
              initial: {
                method: RequestMethod.NONE,
                code: `context.panel.setFormValue({ test2: '15' });`,
              },
            },
          })
        )
      );

      expect(replaceVariables).toHaveBeenCalledWith(`context.panel.setFormValue({ test2: '15' });`);

      expect(elementsSelectors.fieldNumber()).toBeInTheDocument();
      expect(elementsSelectors.fieldNumber()).toHaveValue(15);
    });

    it('Should execute code on initial request with formValue correctly', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              elements: [
                { id: 'test', type: FormElementType.STRING, value: 'success test' },
                { id: 'test2', type: FormElementType.NUMBER, value: 10 },
              ],
              initial: {
                method: RequestMethod.NONE,
                code: `const payload = context.panel.formValue; context.grafana.notifySuccess(payload.test)`,
              },
            },
          })
        )
      );

      expect(replaceVariables).toHaveBeenCalledWith(
        `const payload = context.panel.formValue; context.grafana.notifySuccess(payload.test)`
      );

      expect(elementsSelectors.fieldNumber()).toBeInTheDocument();
      expect(elementsSelectors.fieldNumber()).toHaveValue(10);

      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success test',
      });
    });

    it('Should execute code on update request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {},
        update: {
          method: RequestMethod.NONE,
          code: 'context.grafana.notifySuccess("success"); context.grafana.notifyError("error");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
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
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonSubmit()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonSubmit());
      });

      expect(replaceVariables).toHaveBeenCalledWith(defaultOptions.update.code);
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
    });

    it('Should execute code refresh on dashboard scene on initial request', async () => {
      const onRefresh = jest.fn();

      jest.mocked(useDashboardRefresh).mockReturnValue(() => onRefresh());

      window.__grafanaSceneContext = {
        body: {
          text: 'hello',
        },
      };

      jest.mocked(sceneGraph.getTimeRange).mockReturnValue({
        onRefresh: jest.fn(),
      } as any);

      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: 'context.grafana.refresh()',
              },
            },
          })
        )
      );

      /**
       * Dashboard should be refreshed
       */
      expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('Should execute code refresh on dashboard on initial request', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              initial: {
                method: RequestMethod.NONE,
                code: 'context.grafana.refresh()',
              },
            },
          })
        )
      );

      /**
       * Dashboard should be refreshed
       */
      expect(mockRefreshDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset actions', () => {
    it('Should execute initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `notifySuccess("success");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.INITIAL,
          code: 'notifyError("error");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
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
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      /**
       * Check if URL message shown
       */
      expect(selectors.errorMessage()).toBeInTheDocument();
      expect(within(selectors.errorMessage()).getByText('Please select URL for Initial Request.')).toBeInTheDocument();
    });

    it('Should execute custom reset code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `context.grafana.notifyError("error");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.CUSTOM,
          code: 'context.grafana.notifySuccess("success");',
        },
      };
      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
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
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(replaceVariables).toHaveBeenCalledWith(defaultOptions.resetAction.code);

      /**
       * replaceVariables called for buttons titles
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(9);
      expect(appEventsMock.publish).toHaveBeenCalledWith({
        type: AppEvents.alertSuccess.name,
        payload: 'success',
      });
      expect(appEventsMock.publish).not.toHaveBeenCalledWith({
        type: AppEvents.alertError.name,
        payload: 'error',
      });
    });

    it('Should run reset datasource request', async () => {
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

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: 'abc',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Reset replaceVariables calls count
       */
      replaceVariables.mockClear();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(datasourceRequestMock).toHaveBeenCalledWith({
        datasource: 'abc',
        payload: {
          key1: 'value',
        },
        replaceVariables: expect.any(Function),
        query: {
          sql: 'select *;',
        },
      });

      /**
       * Check if replace variables called for get payload function
       * replaceVariables called for buttons titles, labels, section labels
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(12);
    });

    it('Should not run reset datasource request if datasource not specified', async () => {
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

      const datasourceRequestMock = jest.fn(() =>
        Promise.resolve({
          data: [],
          state: LoadingState.Done,
        })
      ) as any;
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: '',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
                payload: {
                  sql: 'select *;',
                },
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Reset replaceVariables calls count
       */
      replaceVariables.mockClear();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      expect(datasourceRequestMock).not.toHaveBeenCalled();

      /**
       * Check if replace variables called for get payload function
       * replaceVariables called for buttons titles
       * number of calls increased
       */
      expect(replaceVariables).toHaveBeenCalledTimes(4);
    });

    it('Should show reset datasource request error', async () => {
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

      const datasourceRequestMock = jest.fn(() =>
        Promise.reject({
          data: [],
          state: LoadingState.Error,
        })
      );
      jest.mocked(useDatasourceRequest).mockImplementation(() => datasourceRequestMock);

      const { rerender } = await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 123 },
              ],
            },
          })
        )
      );
      /**
       * Trigger element updates
       */
      await act(async () =>
        rerender(
          getComponent({
            options: {
              elements: [
                { ...FORM_ELEMENT_DEFAULT, id: 'test', value: '123' },
                { type: FormElementType.NUMBER, id: 'number', value: 111 },
                { type: FormElementType.DISABLED, id: 'disabled', value: '222' },
              ],
              resetAction: {
                datasource: 'abc',
                mode: ResetActionMode.DATASOURCE,
                payloadMode: PayloadMode.CUSTOM,
                getPayload: `return { key1: 'value' }`,
              },
            },
          })
        )
      );

      /**
       * Check if Reset can be run
       */
      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Run reset request
       */
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      await waitFor(() => expect(selectors.errorMessage()).toBeInTheDocument());
    });

    it('Should ask to confirm', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const defaultOptions = {
        initial: {
          code: `context.grafana.notifySuccess("success");`,
        },
        update: {},
        resetAction: {
          mode: ResetActionMode.CUSTOM,
          code: 'context.grafana.notifySuccess("success");',
          confirm: true,
        },
      };

      const { rerender } = await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: defaultOptions,
          })
        )
      );

      await act(async () =>
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
      jest.mocked(appEventsMock.publish).mockClear();

      expect(selectors.buttonReset()).not.toBeDisabled();
      await act(async () => {
        fireEvent.click(selectors.buttonReset());
      });

      /**
       * Check if confirmation shown
       */
      expect(selectors.resetConfirmModal()).toBeInTheDocument();

      /**
       * Confirm reset
       */
      await act(async () => fireEvent.click(selectors.buttonConfirmReset()));

      expect(appEventsMock.publish).toHaveBeenCalled();
    });
  });

  describe('Confirm changes', () => {
    const prepareComponent = async (options?: Partial<PanelOptions>) => {
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'test',
        title: 'Field',
        value: '123',
        uid: 'test123',
      } as FormElement & { type: FormElementType.STRING });
      const elementWithInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'string',
        title: 'Field 2',
        value: '',
        uid: 'string123',
      } as FormElement & { type: FormElementType.STRING });
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [elementWithInitialValue, elementWithoutInitialValue],
              update: { confirm: true },
              ...options,
            },
          })
        )
      );

      return {
        triggerChangeElement,
        elementWithoutInitialValue: elementWithoutInitialValue as LocalFormElement & { type: FormElementType.STRING },
        elementWithInitialValue: elementWithInitialValue as LocalFormElement & { type: FormElementType.STRING },
        initialValues,
      };
    };

    it('Should show changed values if field has initial value', async () => {
      const { triggerChangeElement, elementWithInitialValue, initialValues } = await prepareComponent();

      /**
       * Trigger field change
       */
      await act(async () =>
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
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

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
      await act(async () =>
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
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

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

    it('Should not show hidden elements', async () => {
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elements = [
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'visible',
          title: 'Field',
          value: '1',
          uid: '1',
        } as FormElement & { type: FormElementType.STRING }),
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'hidden',
          title: 'Field',
          value: '2',
          uid: '2',
          hidden: true,
        } as FormElement & { type: FormElementType.STRING }),
        toLocalFormElement({
          ...FORM_ELEMENT_DEFAULT,
          id: 'hiddenByCode',
          title: 'Field',
          value: '3',
          uid: '3',
          hidden: true,
        } as FormElement & { type: FormElementType.STRING }),
      ];

      await act(async () =>
        render(
          getComponent({
            options: {
              elements,
              update: {
                confirm: true,
              },
            },
          })
        )
      );

      /**
       * Trigger field change
       */
      await act(async () => triggerChangeElement(elements[0]));

      /**
       * Check if submit button is enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Open confirm modal
       */
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check only visible field is shown
       */
      expect(selectors.confirmModalField(false, elements[0].id)).toBeInTheDocument();
      expect(selectors.confirmModalField(true, elements[1].id)).not.toBeInTheDocument();
      expect(selectors.confirmModalField(true, elements[2].id)).not.toBeInTheDocument();
    });

    it('Should show only included columns', async () => {
      const { triggerChangeElement, elementWithInitialValue } = await prepareComponent({
        confirmModal: {
          columns: {
            include: [ModalColumnName.NEW_VALUE],
          },
        } as any,
      });

      /**
       * Trigger field change
       */
      await act(async () =>
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
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

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
       * Check if only included columns are shown
       */
      const updatedFieldSelectors = getPanelSelectors(within(updatedField));
      expect(updatedFieldSelectors.confirmModalFieldTitle(true)).not.toBeInTheDocument();
      expect(updatedFieldSelectors.confirmModalFieldPreviousValue(true)).not.toBeInTheDocument();
      expect(updatedFieldSelectors.confirmModalFieldValue()).toBeInTheDocument();
    });

    it('Should not show table if no included columns', async () => {
      const { triggerChangeElement, elementWithInitialValue } = await prepareComponent({
        confirmModal: {
          columns: {
            include: [],
          },
        } as any,
      });

      /**
       * Trigger field change
       */
      await act(async () =>
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
      await act(async () => fireEvent.click(selectors.buttonSubmit()));

      /**
       * Check confirm modal presence
       */
      expect(selectors.confirmModalContent()).toBeInTheDocument();

      /**
       * Check no columns are show
       */
      expect(selectors.confirmModalField(true, elementWithInitialValue.id)).not.toBeInTheDocument();
    });
  });

  describe('Save default values', () => {
    it('Should update options', async () => {
      const onOptionsChange = jest.fn();
      let triggerChangeElement: (element: LocalFormElement) => void = jest.fn();
      jest.mocked(FormElements).mockImplementation(({ onChangeElement }) => {
        triggerChangeElement = onChangeElement;
        return null;
      });

      const elementWithoutInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'test',
        title: 'Field',
        value: '123',
        uid: 'test123',
      } as FormElement & { type: FormElementType.STRING });
      const elementWithInitialValue = toLocalFormElement({
        ...FORM_ELEMENT_DEFAULT,
        id: 'string',
        title: 'Field 2',
        value: '',
        uid: 'string123',
      } as FormElement & { type: FormElementType.STRING });
      const initialValues = {
        [elementWithInitialValue.id]: 'abc',
      };
      jest.mocked(fetch).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: jest.fn(() => Promise.resolve(initialValues)),
        } as any);
      });

      await act(async () =>
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

      await act(async () =>
        triggerChangeElement({
          ...elementWithoutInitialValue,
          value: '111',
        } as LocalFormElement & { type: FormElementType.STRING })
      );

      expect(selectors.buttonSaveDefault()).toBeInTheDocument();

      expect(onOptionsChange).not.toHaveBeenCalled();

      /**
       * Save Default values
       */
      await act(async () => fireEvent.click(selectors.buttonSaveDefault()));

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
      await act(async () =>
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

  describe('Value Changed Code', () => {
    const element = {
      ...FORM_ELEMENT_DEFAULT,
      id: 'value',
    };

    beforeEach(() => {
      jest.mocked(FormElements).mockImplementation(({ onChangeElement, elements }) => {
        return (
          <input
            data-testid={TEST_IDS.formElements.fieldString}
            value={elements[0].value as string}
            onChange={(event) => {
              onChangeElement({
                ...elements[0],
                value: event.currentTarget.value,
              } as any);
            }}
          />
        );
      });
    });

    it('Should trigger if value changed', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                {
                  ...element,
                  value: '1',
                },
              ],
              elementValueChanged: `
                context.panel.disableSubmit();
              `,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Change to same value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Value changed should not be called
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();

      /**
       * Change to new value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should allow to refresh dashboard in dashboard scene', async () => {
      const onRefresh = jest.fn();

      jest.mocked(useDashboardRefresh).mockReturnValue(() => onRefresh());

      window.__grafanaSceneContext = {
        body: {
          text: 'hello',
        },
      };

      jest.mocked(sceneGraph.getTimeRange).mockReturnValue({
        onRefresh: jest.fn(),
      } as any);

      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                {
                  ...element,
                  value: '1',
                },
              ],
              elementValueChanged: `
                context.grafana.refresh();
              `,
            },
          })
        )
      );

      /**
       * Change value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Dashboard should be refreshed
       */
      expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('Should allow to refresh dashboard', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [
                {
                  ...element,
                  value: '1',
                },
              ],
              elementValueChanged: `
                context.grafana.refresh();
              `,
            },
          })
        )
      );

      /**
       * Change value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Dashboard should be refreshed
       */
      expect(mockRefreshDashboard).toHaveBeenCalledTimes(1);
    });

    it('Should allow to manage submit button', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [element],
              elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableSubmit();
                } else {
                  context.panel.disableSubmit();
                }
              `,
              updateEnabled: UpdateEnabledMode.MANUAL,
            },
          })
        )
      );

      expect(selectors.buttonSubmit()).toBeInTheDocument();
      expect(selectors.buttonSubmit()).toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonSubmit()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSubmit()).not.toBeDisabled();
    });

    it('Should allow to manage reset button', async () => {
      await act(async () =>
        render(
          getComponent({
            options: {
              elements: [element],
              elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableReset();
                } else {
                  context.panel.disableReset();
                }
              `,
            },
          })
        )
      );

      expect(selectors.buttonReset()).toBeInTheDocument();
      expect(selectors.buttonReset()).not.toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonReset()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonReset()).not.toBeDisabled();
    });

    it('Should allow to manage save default button', async () => {
      await act(async () =>
        render(
          <PanelContextProvider value={{ canAddAnnotations: () => true } as any}>
            {getComponent({
              options: {
                elements: [element],
                saveDefault: {
                  variant: ButtonVariant.SECONDARY,
                },
                elementValueChanged: `
                if (context.element.value === '11') {
                  context.panel.enableSaveDefault();
                } else {
                  context.panel.disableSaveDefault();
                }
              `,
              },
            })}
          </PanelContextProvider>
        )
      );

      expect(selectors.buttonSaveDefault()).toBeInTheDocument();
      expect(selectors.buttonSaveDefault()).not.toBeDisabled();

      /**
       * Change to invalid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '1' } }));

      /**
       * Still should be disabled due to invalid value
       */
      expect(selectors.buttonSaveDefault()).toBeDisabled();

      /**
       * Change to valid value
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(), { target: { value: '11' } }));

      /**
       * Should be enabled
       */
      expect(selectors.buttonSaveDefault()).not.toBeDisabled();
    });
  });

  describe('Collapsable Sections', () => {
    it('Should expand section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.sectionsUtils.expand("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should collapse section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.sectionsUtils.collapse("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });

    it('Should toggle section from the initial code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
                code: `
                  context.panel.sectionsUtils.toggle("section1");
                `,
              },
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [section],
              },
            },
          })
        )
      );

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should expand section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: false };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.sectionsUtils.expand("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();
    });

    it('Should collapse section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.sectionsUtils.collapse("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Check initial section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      /**
       * Check updated section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });

    it('Should toggle section from the value changed code', async () => {
      /**
       * Render
       */
      const replaceVariables = jest.fn((code) => code);

      const section = { id: 'section1', name: 'Section 1', expanded: true };

      await act(async () =>
        render(
          getComponent({
            props: {
              replaceVariables,
            },
            options: {
              sync: false,
              initial: {
                method: RequestMethod.NONE,
              },
              elementValueChanged: `
                context.panel.sectionsUtils.toggle("section1");
              `,
              layout: {
                variant: LayoutVariant.SPLIT,
                orientation: LayoutOrientation.VERTICAL,
                sectionVariant: SectionVariant.COLLAPSABLE,
                sections: [{ id: 'section2', name: 'Section 2', expanded: true }, section],
              },
              elements: [{ ...FORM_ELEMENT_DEFAULT, type: FormElementType.STRING, section: 'section2' }],
            },
          })
        )
      );

      /**
       * Check initial section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(false, section.id, section.name)).toBeInTheDocument();

      /**
       * Trigger element value change
       */
      await act(async () => fireEvent.change(elementsSelectors.fieldString(false), { target: { value: '123' } }));

      /**
       * Check updated section state
       */
      expect(sectionSelectors.sectionHeader(false, section.id, section.name)).toBeInTheDocument();
      expect(sectionSelectors.sectionContent(true, section.id, section.name)).not.toBeInTheDocument();
    });
  });
});
