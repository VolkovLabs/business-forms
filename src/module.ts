import { PanelPlugin, SelectableValue } from '@grafana/data';
import { getAvailableIcons } from '@grafana/ui';
import { FormPanel, InputParametersEditor } from './components';
import {
  ButtonOrientation,
  ButtonOrientationOptions,
  ButtonSize,
  ButtonSizeOptions,
  ButtonVariant,
  ButtonVariantOptions,
  ContentType,
  ContentTypeOptions,
  RequestMethod,
  RequestMethodGetOptions,
  RequestMethodPostOptions,
} from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(FormPanel).setPanelOptions((builder) => {
  /**
   * Parameters
   */
  builder.addCustomEditor({
    id: 'parameters',
    path: 'parameters',
    name: 'Form Parameters',
    category: ['Form Parameters'],
    description: 'Input parameters',
    editor: InputParametersEditor,
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
        options: RequestMethodGetOptions,
      },
      defaultValue: RequestMethod.GET,
    })
    .addTextInput({
      path: 'initial.url',
      name: 'URL',
      category: ['Initial Request'],
      description: 'The URL to call',
      defaultValue: 'http://api.example.com/',
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
        options: RequestMethodPostOptions,
      },
      defaultValue: RequestMethod.POST,
    })
    .addTextInput({
      path: 'update.url',
      name: 'URL',
      category: ['Update Request'],
      description: 'The URL to call',
      defaultValue: 'http://api.example.com/',
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
      showIf: (config) => config.update.method === RequestMethod.POST,
    });

  /**
   * Submit Button
   */
  builder
    .addRadio({
      path: 'submit.variant',
      name: 'Submit Button',
      category: ['Submit Button'],
      description: 'Button variant used to render',
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
      defaultValue: 'yellow',
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
      defaultValue: 'purple',
      settings: {
        disableNamedColors: true,
      },
      showIf: (config: any) => config.submit.variant === ButtonVariant.CUSTOM,
    })
    .addRadio({
      path: 'submit.orientation',
      name: 'Orientation',
      category: ['Submit Button'],
      description: 'Button orientation used to render',
      settings: {
        options: ButtonOrientationOptions,
      },
      defaultValue: ButtonOrientation.CENTER,
    })
    .addRadio({
      path: 'submit.size',
      name: 'Size',
      category: ['Submit Button'],
      description: 'Button size used to render',
      settings: {
        options: ButtonSizeOptions,
      },
      defaultValue: ButtonSize.MEDIUM,
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
      defaultValue: 'cloud-upload',
    })
    .addTextInput({
      path: 'submit.text',
      name: 'Text',
      category: ['Submit Button'],
      description: 'The text on the button',
      defaultValue: 'Submit',
    });

  return builder;
});
