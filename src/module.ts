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
  CodeEditorDefault,
  CodeLanguage,
  ContentType,
  ContentTypeOptions,
  LayoutVariant,
  LayoutVariantOptions,
  RequestMethod,
  RequestMethodInitialOptions,
  RequestMethodUpdateOptions,
  ResetBackgroundColorDefault,
  ResetForegroundColorDefault,
  ResetIconDefault,
  ResetTextDefault,
  SubmitBackgroundColorDefault,
  SubmitForegroundColorDefault,
  SubmitIconDefault,
  SubmitTextDefault,
} from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(FormPanel).setPanelOptions((builder) => {
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
  });

  /**
   * Initial Values
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
      description: 'Custom code to execute after initial request',
      editor: CustomCodeEditor,
      category: ['Initial Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: CodeEditorDefault,
    });

  /**
   * Update Values
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
      showIf: (config) => config.update.method !== RequestMethod.NONE,
    })
    .addCustomEditor({
      id: 'update.header',
      path: 'update.header',
      name: 'Header Parameters',
      category: ['Update Request'],
      editor: HeaderParametersEditor,
      showIf: (config) => config.update.method !== RequestMethod.NONE,
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
      showIf: (config) => !!config.update.url && config.update.method !== RequestMethod.NONE,
    })
    .addCustomEditor({
      id: 'update.code',
      path: 'update.code',
      name: 'Custom Code',
      description: 'Custom code to execute after update request',
      editor: CustomCodeEditor,
      category: ['Update Request'],
      settings: {
        language: CodeLanguage.JAVASCRIPT,
      },
      defaultValue: CodeEditorDefault,
    });

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
    .addCustomEditor({
      id: 'layout.sections',
      path: 'layout.sections',
      name: 'Sections',
      category: ['Layout'],
      editor: LayoutSectionsEditor,
      showIf: (config: any) => config.layout.variant === LayoutVariant.SPLIT,
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

  return builder;
});
