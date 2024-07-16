import { PanelPlugin } from '@grafana/data';

import { LayoutVariant, PayloadMode, RequestMethod, ResetActionMode } from './constants';
import { plugin } from './module';
import { ButtonVariant, PanelOptions } from './types';

/*
 Plugin
 */
describe('plugin', () => {
  /**
   * Builder
   */
  const builder: any = {
    addColorPicker: jest.fn(),
    addCustomEditor: jest.fn(),
    addRadio: jest.fn(),
    addSelect: jest.fn(),
    addSliderInput: jest.fn(),
    addTextInput: jest.fn(),
    addMultiSelect: jest.fn(),
  };

  const addFieldMock = () => builder;

  beforeEach(() => {
    builder.addColorPicker.mockImplementation(addFieldMock);
    builder.addCustomEditor.mockImplementation(addFieldMock);
    builder.addRadio.mockImplementation(addFieldMock);
    builder.addSelect.mockImplementation(addFieldMock);
    builder.addSliderInput.mockImplementation(addFieldMock);
    builder.addTextInput.mockImplementation(addFieldMock);
    builder.addMultiSelect.mockImplementation(addFieldMock);
  });

  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
    /**
     * Supplier
     */
    plugin['optionsSupplier'](builder);

    /**
     * Inputs
     */
    expect(builder.addColorPicker).toHaveBeenCalled();
    expect(builder.addCustomEditor).toHaveBeenCalled();
    expect(builder.addRadio).toHaveBeenCalled();
    expect(builder.addSelect).toHaveBeenCalled();
    expect(builder.addSliderInput).toHaveBeenCalled();
    expect(builder.addTextInput).toHaveBeenCalled();
  });

  describe('Input Visibility', () => {
    /**
     * Add Input Implementation
     * @param config
     * @param result
     */
    const addInputImplementation = (config: Partial<PanelOptions>, result: string[]) => (input: any) => {
      if (input.showIf) {
        if (
          input.showIf({
            initial: {},
            layout: {},
            update: {},
            reset: {},
            saveDefault: {},
            submit: {},
            resetAction: {},
            ...config,
          })
        ) {
          result.push(input.path);
        }
      } else {
        result.push(input.path);
      }

      return builder;
    };

    it('Should show layout sections and orientation if split layout enabled', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ layout: { variant: LayoutVariant.SPLIT } as any }, shownOptionsPaths)
      );
      builder.addRadio.mockImplementation(
        addInputImplementation({ layout: { variant: LayoutVariant.SPLIT } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['layout.sections', 'layout.orientation']));
    });

    it('Should show initial url and header if method specified', () => {
      const shownOptionsPaths: string[] = [];

      builder.addTextInput.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.GET } as any }, shownOptionsPaths)
      );
      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.GET } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['initial.url', 'initial.header']));
    });

    it('Should show initial contentType if method POST', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.POST } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['initial.contentType']));
    });

    it('Should show initial code if method set', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.POST } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['initial.code']));
    });

    it('Should show initial code if method not set', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.NONE } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['initial.code']));
    });

    it('Should show initial highlightColor if highlight enabled', () => {
      const shownOptionsPaths: string[] = [];

      builder.addColorPicker.mockImplementation(
        addInputImplementation({ initial: { highlight: true } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['initial.highlightColor']));
    });

    it('Should show update url and header if method specified', () => {
      const shownOptionsPaths: string[] = [];

      builder.addTextInput.mockImplementation(
        addInputImplementation({ initial: { method: RequestMethod.GET } as any }, shownOptionsPaths)
      );
      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ update: { method: RequestMethod.GET } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['update.url', 'update.header']));
    });

    it('Should show update contentType if method and url specified', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ update: { method: RequestMethod.POST, url: 'abc.com' } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['update.contentType']));
    });

    it('Should show update payloadMode and confirm if layout enabled', () => {
      const shownOptionsPaths: string[] = [];

      builder.addRadio.mockImplementation(
        addInputImplementation({ layout: { variant: LayoutVariant.SINGLE } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['update.payloadMode', 'update.confirm']));
    });

    it('Should show update getPayload if payloadMode custom', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation({ update: { payloadMode: PayloadMode.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['update.getPayload']));
    });

    it('Should show submit foregroundColor and backgroundColor if variant custom', () => {
      const shownOptionsPaths: string[] = [];

      builder.addColorPicker.mockImplementation(
        addInputImplementation({ submit: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['submit.foregroundColor', 'submit.backgroundColor']));
    });

    it('Should show reset foregroundColor and backgroundColor if variant custom', () => {
      const shownOptionsPaths: string[] = [];

      builder.addColorPicker.mockImplementation(
        addInputImplementation({ reset: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['reset.foregroundColor', 'reset.backgroundColor']));
    });

    it('Should show reset icon and text if variant is not hidden', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ reset: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      builder.addTextInput.mockImplementation(
        addInputImplementation({ reset: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['reset.icon', 'reset.text']));
    });

    it('Should show saveDefault icon and text if variant is not hidden', () => {
      const shownOptionsPaths: string[] = [];

      builder.addSelect.mockImplementation(
        addInputImplementation({ saveDefault: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      builder.addTextInput.mockImplementation(
        addInputImplementation({ saveDefault: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['saveDefault.icon', 'saveDefault.text']));
    });

    it('Should show reset action mode if reset button visible', () => {
      const shownOptionsPaths: string[] = [];

      builder.addRadio.mockImplementation(
        addInputImplementation({ reset: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['resetAction.mode']));
    });

    it('Should show reset action code if reset button visible and mode custom', () => {
      const shownOptionsPaths: string[] = [];

      builder.addRadio.mockImplementation(
        addInputImplementation({ reset: { variant: ButtonVariant.CUSTOM } as any }, shownOptionsPaths)
      );
      builder.addCustomEditor.mockImplementation(
        addInputImplementation(
          { reset: { variant: ButtonVariant.CUSTOM } as any, resetAction: { mode: ResetActionMode.CUSTOM } as any },
          shownOptionsPaths
        )
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['resetAction.code']));
    });

    it('Should show reset payload if reset action is data source', () => {
      const shownOptionsPaths: string[] = [];

      builder.addCustomEditor.mockImplementation(
        addInputImplementation(
          {
            reset: { variant: ButtonVariant.CUSTOM } as any,
            resetAction: { mode: ResetActionMode.DATASOURCE, datasource: '123' } as any,
          },
          shownOptionsPaths
        )
      );
      plugin['optionsSupplier'](builder);

      expect(shownOptionsPaths).toEqual(expect.arrayContaining(['resetAction.getPayload']));
    });
  });
});
