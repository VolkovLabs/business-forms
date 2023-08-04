import { PanelPlugin, SelectableValue } from '@grafana/data';
import { getAvailableIcons } from '@grafana/ui';
import {
  CustomCodeEditor,
  FormElementsEditor,
  FormPanel,
  HeaderParametersEditor,
  LayoutSectionsEditor,
} from './components';
import {
  ButtonOrientation,
  ButtonOrientationOptions,
  ButtonSize,
  ButtonSizeOptions,
  ButtonVariant,
  ButtonVariantHiddenOption,
  ButtonVariantOptions,
  CodeInitialDefault,
  CodeLanguage,
  CodeUpdateDefault,
  ContentType,
  ContentTypeOptions,
  GetPayloadDefault,
  InitialHighlightColorDefault,
  LayoutOrientation,
  LayoutOrientationOptions,
  LayoutVariant,
  LayoutVariantOptions,
  PayloadMode,
  PayloadModeOptions,
  RequestMethod,
  RequestMethodInitialOptions,
  RequestMethodUpdateOptions,
  ResetActionMode,
  ResetActionOptions,
  ResetBackgroundColorDefault,
  ResetForegroundColorDefault,
  ResetIconDefault,
  ResetTextDefault,
  SaveDefaultIconDefault,
  SaveDefaultTextDefault,
  SubmitBackgroundColorDefault,
  SubmitForegroundColorDefault,
  SubmitIconDefault,
  SubmitTextDefault,
} from './constants';
import { PanelOptions, RequestOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(FormPanel).setNoPadding().setPanelOptions((builder) => {
  /**
   * Is Request Configured
   * @param request
   */
  const isRequestConfigured = (request: RequestOptions) => {
    return request.method !== RequestMethod.NONE;
  };

  /**
   * Layout
   */
  builder
    .addRadio({
      path: 'layout.variant',
      name: 'Layout',
      category: ['Layout'],
      settings: {
        options: LayoutVariantOptions,
      },
      defaultValue: LayoutVariant.SINGLE,
    })
    .addSliderInput({
      path: 'layout.padding',
      name: 'Padding',
      category: ['Layout'],
      defaultValue: 10,
      settings: {
        min: 0,
        max: 20,
      },
    });

  /**
   * Sections
   */
  builder
    .addCustomEditor({
      id: 'layout.sections',
      path: 'layout.sections',
      name: 'Sections',
      category: ['Sections'],
      editor: LayoutSectionsEditor,
      showIf: (config: any) => config.layout.variant === LayoutVariant.SPLIT,
    })
    .addRadio({
      path: 'layout.orientation',
      name: 'Orientation',
      category: ['Sections'],
      settings: {
        options: LayoutOrientationOptions,
      },
      defaultValue: LayoutOrientation.HORIZONTAL,
      showIf: (config) => config.layout.variant === LayoutVariant.SPLIT,
    });

  /**
   * Elements
   */
  builder.addCustomEditor({
    id: 'elements',
    path: 'elements',
    name: 'Form Elements',
    category: ['Form Elements'],
    description: 'Form Elements',
    editor: FormElementsEditor,
    showIf: (config: any) => config.layout.variant !== LayoutVariant.NONE,
  });

  /**
   * Initial Request
   */
  builder
    .addRadio({
      path: 'initial.method',
      name: 'Initial Request',
      category: ['Initial Request'],
      settings: {
        options: RequestMethodInitialOptions,
      },
      defaultValue: RequestMethod.NONE,
    })
    .addTextInput({
      path: 'initial.url',
      name: 'URL',
      category: ['Initial Request'],
      description: 'The URL to call. Leave empty to skip Initial Request.',
      settings: {
        placeholder: 'http://',
      },
      showIf: (config) => config.initial.method !== RequestMethod.NONE,
    })
    .addCustomEditor({
      id: 'initial.header',
      path: 'initial.header',
      name: 'Header Parameters',
      category: ['Initial Request'],
      editor: HeaderParametersEditor,
      showIf: (config) => config.initial.method !== RequestMethod.NONE,
    })
    .addSelect({
      path: 'initial.contentType',
      name: 'Content-Type',
      category: ['Initial Request'],
      description: 'Content-Type of the payload',
      defaultValue: ContentType.JSON,
      settings: {
        allowCustomValue: true,
        options: ContentTypeOptions,
      },
      showIf: (config) => config.initial.method === RequestMethod.POST,
    })
    .addCustomEditor({
      id: 'initial.code',
      path: 'initial.code',
      name: 'Custom Code',
      description: 'Custom code to execute initial request.',
      editor: CustomCodeEditor,
      category: ['Initial Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
        suggestions: true,
      },
      defaultValue: CodeInitialDefault,
      showIf: (config) => !isRequestConfigured(config.initial),
    })
    .addCustomEditor({
      id: 'initial.code',
      path: 'initial.code',
      name: 'Custom Code',
      description: 'Custom code to execute after initial request.',
      editor: CustomCodeEditor,
      category: ['Initial Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
        suggestions: true,
      },
      defaultValue: CodeInitialDefault,
      showIf: (config) => isRequestConfigured(config.initial),
    });

  /**
   * Highlight
   */
  builder
    .addRadio({
      path: 'initial.highlight',
      name: 'Highlight Changes',
      description: 'Some elements are not supporting highlighting.',
      category: ['Highlight Changes'],
      settings: {
        options: [
          {
            value: true,
            label: 'Enabled',
          },
          {
            value: false,
            label: 'Disabled',
          },
        ],
      },
      defaultValue: false,
      showIf: (config: any) => config.layout.variant !== LayoutVariant.NONE,
    })
    .addColorPicker({
      path: 'initial.highlightColor',
      name: 'Color',
      category: ['Highlight Changes'],
      defaultValue: InitialHighlightColorDefault,
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.initial.highlight && config.layout.variant !== LayoutVariant.NONE,
    });

  /**
   * Update Request
   */
  builder
    .addRadio({
      path: 'update.method',
      name: 'Update Request',
      category: ['Update Request'],
      settings: {
        options: RequestMethodUpdateOptions,
      },
      defaultValue: RequestMethod.NONE,
    })
    .addTextInput({
      path: 'update.url',
      name: 'URL',
      category: ['Update Request'],
      description: 'The URL to call',
      settings: {
        placeholder: 'http://',
      },
      showIf: (config) => isRequestConfigured(config.update),
    })
    .addCustomEditor({
      id: 'update.header',
      path: 'update.header',
      name: 'Header Parameters',
      category: ['Update Request'],
      editor: HeaderParametersEditor,
      showIf: (config) => isRequestConfigured(config.update),
    })
    .addSelect({
      path: 'update.contentType',
      name: 'Content-Type',
      category: ['Update Request'],
      description: 'Content-Type of the payload',
      defaultValue: ContentType.JSON,
      settings: {
        allowCustomValue: true,
        options: ContentTypeOptions,
      },
      showIf: (config) => isRequestConfigured(config.update),
    })
    .addRadio({
      path: 'update.payloadMode',
      name: 'Payload',
      description: 'Choose what values will be included in payload.',
      category: ['Update Request'],
      settings: {
        options: PayloadModeOptions,
      },
      defaultValue: PayloadMode.ALL,
      showIf: (config) => isRequestConfigured(config.update) && config.layout.variant !== LayoutVariant.NONE,
    })
    .addCustomEditor({
      id: 'update.getPayload',
      path: 'update.getPayload',
      name: 'Get Payload',
      description: 'Custom code to get payload for update request.',
      editor: CustomCodeEditor,
      category: ['Update Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: GetPayloadDefault,
      showIf: (config) => isRequestConfigured(config.update) && config.update.payloadMode === PayloadMode.CUSTOM,
    })
    .addCustomEditor({
      id: 'update.code',
      path: 'update.code',
      name: 'Custom Code',
      description: 'Custom code to execute after update request.',
      editor: CustomCodeEditor,
      category: ['Update Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: CodeUpdateDefault,
      showIf: (config) => isRequestConfigured(config.update),
    })
    .addCustomEditor({
      id: 'update.code',
      path: 'update.code',
      name: 'Custom Code',
      description: 'Custom code to execute update request.',
      editor: CustomCodeEditor,
      category: ['Update Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: CodeUpdateDefault,
      showIf: (config) => !isRequestConfigured(config.update),
    })
    .addRadio({
      path: 'update.confirm',
      name: 'Confirmation',
      description: 'Ask to confirm updated values.',
      category: ['Update Request'],
      settings: {
        options: [
          {
            value: false,
            label: 'No',
          },
          {
            value: true,
            label: 'Require',
          },
        ],
      },
      defaultValue: false,
      showIf: (config: any) => config.layout.variant !== LayoutVariant.NONE,
    });

  /**
   * Payload
   */
  builder
    .addRadio({
      path: 'update.payloadMode',
      name: 'Update Request Payload',
      description: 'Choose what values will be included in payload.',
      category: ['Update Request Payload'],
      settings: {
        options: PayloadModeOptions,
      },
      defaultValue: PayloadMode.ALL,
      showIf: (config) => isRequestConfigured(config.update) && config.layout.variant !== LayoutVariant.NONE,
    })
    .addCustomEditor({
      id: 'update.getPayload',
      path: 'update.getPayload',
      name: 'Create Payload',
      description: 'Custom code to create payload for the update request.',
      editor: CustomCodeEditor,
      category: ['Update Request Payload'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: GetPayloadDefault,
      showIf: (config) => isRequestConfigured(config.update) && config.update.payloadMode === PayloadMode.CUSTOM,
    });

  /**
   * Buttons
   */
  builder
    .addRadio({
      path: 'buttonGroup.orientation',
      name: 'Orientation',
      category: ['Buttons'],
      description: 'Buttons orientation on the form',
      settings: {
        options: ButtonOrientationOptions,
      },
      defaultValue: ButtonOrientation.CENTER,
    })
    .addRadio({
      path: 'buttonGroup.size',
      name: 'Size',
      category: ['Buttons'],
      description: 'Buttons size on the form',
      settings: {
        options: ButtonSizeOptions,
      },
      defaultValue: ButtonSize.MEDIUM,
    });

  /**
   * Submit Button
   */
  builder
    .addRadio({
      path: 'submit.variant',
      name: 'Submit Button',
      category: ['Submit Button'],
      description: 'Button variant',
      settings: {
        options: ButtonVariantOptions,
      },
      defaultValue: ButtonVariant.PRIMARY,
    })
    .addColorPicker({
      path: 'submit.foregroundColor',
      name: 'Foreground Color',
      category: ['Submit Button'],
      description: 'Foreground color of the button',
      defaultValue: SubmitForegroundColorDefault,
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.submit.variant === ButtonVariant.CUSTOM,
    })
    .addColorPicker({
      path: 'submit.backgroundColor',
      name: 'Background Color',
      category: ['Submit Button'],
      description: 'Background color of the button',
      defaultValue: SubmitBackgroundColorDefault,
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.submit.variant === ButtonVariant.CUSTOM,
    })
    .addSelect({
      path: 'submit.icon',
      name: 'Icon',
      category: ['Submit Button'],
      settings: {
        options: getAvailableIcons().map((icon): SelectableValue => {
          return {
            value: icon,
            label: icon,
          };
        }),
      },
      defaultValue: SubmitIconDefault,
    })
    .addTextInput({
      path: 'submit.text',
      name: 'Text',
      category: ['Submit Button'],
      description: 'The text on the button',
      defaultValue: SubmitTextDefault,
    });

  /**
   * Reset Button
   */
  builder
    .addRadio({
      path: 'reset.variant',
      name: 'Reset Button',
      category: ['Reset Button'],
      description: 'Button variant',
      settings: {
        options: [...ButtonVariantHiddenOption, ...ButtonVariantOptions],
      },
      defaultValue: ButtonVariant.HIDDEN,
    })
    .addColorPicker({
      path: 'reset.foregroundColor',
      name: 'Foreground Color',
      category: ['Reset Button'],
      description: 'Foreground color of the button',
      defaultValue: ResetForegroundColorDefault,
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.reset.variant === ButtonVariant.CUSTOM,
    })
    .addColorPicker({
      path: 'reset.backgroundColor',
      name: 'Background Color',
      category: ['Reset Button'],
      description: 'Background color of the button',
      defaultValue: ResetBackgroundColorDefault,
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.reset.variant === ButtonVariant.CUSTOM,
    })
    .addSelect({
      path: 'reset.icon',
      name: 'Icon',
      category: ['Reset Button'],
      settings: {
        options: getAvailableIcons().map((icon): SelectableValue => {
          return {
            value: icon,
            label: icon,
          };
        }),
      },
      defaultValue: ResetIconDefault,
      showIf: (config: any) => config.reset.variant !== ButtonVariant.HIDDEN,
    })
    .addTextInput({
      path: 'reset.text',
      name: 'Text',
      category: ['Reset Button'],
      description: 'The text on the button',
      defaultValue: ResetTextDefault,
      showIf: (config: any) => config.reset.variant !== ButtonVariant.HIDDEN,
    });

  /**
   * Reset Action
   */
  builder
    .addRadio({
      path: 'resetAction.mode',
      name: 'Reset Action Mode',
      category: ['Reset request'],
      description: 'What action should be called by clicking on reset button.',
      settings: {
        options: ResetActionOptions,
      },
      defaultValue: ResetActionMode.INITIAL,
      showIf: (config) => config.reset.variant !== ButtonVariant.HIDDEN,
    })
    .addCustomEditor({
      id: 'resetAction.code',
      path: 'resetAction.code',
      name: 'Custom Code',
      description: 'Custom code to execute reset request.',
      editor: CustomCodeEditor,
      category: ['Reset request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: CodeInitialDefault,
      showIf: (config) =>
        config.reset.variant !== ButtonVariant.HIDDEN && config.resetAction.mode === ResetActionMode.CUSTOM,
    });

  /**
   * Save Defaults Button
   */
  builder
    .addRadio({
      path: 'saveDefault.variant',
      name: 'Save Default Button',
      category: ['Save Default Button'],
      description: 'Button variant',
      settings: {
        options: [...ButtonVariantHiddenOption, { value: ButtonVariant.SECONDARY, label: 'Auto' }],
      },
      defaultValue: ButtonVariant.HIDDEN,
    })
    .addSelect({
      path: 'saveDefault.icon',
      name: 'Icon',
      category: ['Save Default Button'],
      settings: {
        options: getAvailableIcons().map((icon): SelectableValue => {
          return {
            value: icon,
            label: icon,
          };
        }),
      },
      defaultValue: SaveDefaultIconDefault,
      showIf: (config: any) => config.saveDefault.variant !== ButtonVariant.HIDDEN,
    })
    .addTextInput({
      path: 'saveDefault.text',
      name: 'Text',
      category: ['Save Default Button'],
      description: 'The text on the button',
      defaultValue: SaveDefaultTextDefault,
      showIf: (config: any) => config.saveDefault.variant !== ButtonVariant.HIDDEN,
    });

  return builder;
});
