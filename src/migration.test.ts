import { FormElementType, PayloadMode } from './constants';
import { getMigratedOptions } from './migration';
import { PanelOptions } from './types';

describe('Migration', () => {
  it('Should return panel options', () => {
    const options: Partial<PanelOptions> = {
      sync: true,
      initial: {} as any,
      update: {} as any,
    };

    expect(
      getMigratedOptions({
        options: options as any,
      } as any)
    ).toEqual(options);
  });

  describe('3.4.0', () => {
    it('Should normalize requestOptions.updatedOnly', () => {
      expect(
        getMigratedOptions({ options: { initial: { updatedOnly: true }, update: { updatedOnly: true } } } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.UPDATED,
        },
        update: {
          payloadMode: PayloadMode.UPDATED,
        },
      });
      expect(
        getMigratedOptions({ options: { initial: { updatedOnly: false }, update: { updatedOnly: false } } } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.ALL,
        },
        update: {
          payloadMode: PayloadMode.ALL,
        },
      });
      expect(
        getMigratedOptions({
          options: {
            initial: { updatedOnly: true, payloadMode: PayloadMode.ALL },
            update: { updatedOnly: true, payloadMode: PayloadMode.ALL },
          },
        } as any)
      ).toEqual({
        initial: {
          payloadMode: PayloadMode.ALL,
        },
        update: {
          payloadMode: PayloadMode.ALL,
        },
      });
    });

    it('Should normalize layout.sections', () => {
      expect(
        getMigratedOptions({
          options: {
            initial: {},
            update: {},
            layout: {
              sections: [{ name: 'section1' }, { id: 'sectionId', name: 'section2' }],
            },
          },
        } as any)
      ).toEqual({
        initial: {},
        update: {},
        layout: {
          sections: [
            { id: 'section1', name: 'section1' },
            { id: 'sectionId', name: 'section2' },
          ],
        },
      });
    });
  });

  describe('4.0.0', () => {
    describe('codeOptions', () => {
      /**
       * Test common code migration
       */

      const options = [
        {
          name: 'options.',
          initial: `
          const optionsValue = "";
          options.value;
          `,
          expected: `
          const optionsValue = "";
          context.panel.options.value;
          `,
        },
        {
          name: 'data.',
          initial: `
          const dataState = "";
          data.state;
          context.panel.data.state;
          `,
          expected: `
          const dataState = "";
          context.panel.data.state;
          context.panel.data.state;
          `,
        },
        {
          name: 'response',
          initial: `
          if(response && response.ok && context.panel.response) {
            action()
          }
          `,
          expected: `
          if(context.panel.response && context.panel.response.ok && context.panel.response) {
            action()
          }
          `,
        },
        {
          name: 'elements.',
          initial: `
          elements.forEach((element) => {
            if (!element.value) {
              return;
            }
          
            payload[element.id] = element.value;
          });
          `,
          expected: `
          context.panel.elements.forEach((element) => {
            if (!element.value) {
              return;
            }
          
            payload[element.id] = element.value;
          });
          `,
        },
        {
          name: 'onChange(',
          initial: `
          onChange();
          `,
          expected: `
          context.panel.onChangeElements();
          `,
        },
        {
          name: 'locationService',
          initial: `
          locationService.method();
          `,
          expected: `
          context.grafana.locationService.method();
          `,
        },
        {
          name: 'templateService',
          initial: `
          templateService.method();
          `,
          expected: `
          context.grafana.templateService.method();
          `,
        },
        {
          name: 'onOptionsChange(',
          initial: `
          onOptionsChange();
          `,
          expected: `
          context.panel.onOptionsChange();
          `,
        },
        {
          name: 'initialRequest(',
          initial: `
          initialRequest();
          `,
          expected: `
          context.panel.initialRequest();
          `,
        },
        {
          name: 'setInitial(',
          initial: `
          setInitial();
          `,
          expected: `
          context.panel.setInitial();
          `,
        },
        {
          name: 'initial',
          initial: `
          const initialFile = initial.file;
          initialFile;
          `,
          expected: `
          const initialFile = context.panel.initial.file;
          initialFile;
          `,
        },
        {
          name: 'notifyError(',
          initial: `
          notifyError();
          `,
          expected: `
          context.grafana.notifyError();
          `,
        },
        {
          name: 'notifySuccess(',
          initial: `
          notifySuccess();
          `,
          expected: `
          context.grafana.notifySuccess();
          `,
        },
        {
          name: 'notifyWarning(',
          initial: `
          notifyWarning();
          `,
          expected: `
          context.grafana.notifyWarning();
          `,
        },
        {
          name: 'toDataQueryResponse(',
          initial: `
          toDataQueryResponse();
          `,
          expected: `
          context.utils.toDataQueryResponse();
          `,
        },
        {
          name: 'other',
          initial: `
          const otherValue = "";
          otherValue;
          `,
          expected: `
          const otherValue = "";
          otherValue;
          `,
        },
      ];
      it.each(options)('Should migrate $name for code', ({ initial, expected }) => {
        expect(
          getMigratedOptions({
            pluginVersion: '3.9.0',
            options: {
              initial: {
                code: initial,
                updatedOnly: true,
                getPayload: 'code',
              },
              resetAction: {
                code: '',
                getPayload: 'code',
              },
              update: {
                code: '',
                getPayload: 'code',
              },
            },
          } as any).initial.code
        ).toEqual(expected);
      });

      /**
       * Test common code migration getPayload
       */
      it.each(options)('Should migrate $name for getPayload', ({ initial, expected }) => {
        expect(
          getMigratedOptions({
            pluginVersion: '3.9.0',
            options: {
              initial: {
                code: '',
                updatedOnly: true,
                getPayload: initial,
              },
              resetAction: {
                code: '',
                getPayload: 'code',
              },
              update: {
                code: '',
                getPayload: 'code',
              },
            },
          } as any).initial.getPayload
        ).toEqual(expected);
      });

      /**
       * Test code migration for disableIf, showIf, getOptions value
       */
      it.each([
        {
          name: 'elements.',
          initial: `
          elements.forEach((element) => {
            if (!element.value) {
              return;
            }
          
            payload[element.id] = element.value;
          });
          `,
          expected: `
          context.panel.elements.forEach((element) => {
            if (!element.value) {
              return;
            }
          
            payload[element.id] = element.value;
          });
          `,
        },
        {
          name: 'replaceVariables(',
          initial: `
          const test = replaceVariables('$var');;
          `,
          expected: `
          const test = context.grafana.replaceVariables('$var');;
          `,
        },
      ])('Should migrate $name for disableIf, showIf, getOptions', ({ initial, expected }) => {
        const options = getMigratedOptions({
          pluginVersion: '3.9.0',
          options: {
            initial: {
              code: '',
              updatedOnly: true,
              getPayload: 'code',
            },
            resetAction: {
              code: '',
              getPayload: 'code',
            },
            update: {
              code: '',
              getPayload: 'code',
            },
            elements: [
              {
                showIf: initial,
                disableIf: initial,
                getOptions: initial,
                type: FormElementType.RADIO,
              },
              {
                showIf: '',
                disableIf: '',
                getOptions: '',
                type: FormElementType.RADIO,
              },
              {
                showIf: '',
                disableIf: '',
              },
            ],
          },
        } as any);

        const element: any = options.elements[0];
        expect(element.showIf).toEqual(expected);
        expect(element.disableIf).toEqual(expected);
        expect(element.getOptions).toEqual(expected);
      });
    });
  });
});
