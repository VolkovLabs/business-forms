import { PanelPlugin } from '@grafana/data';
import { FormPanel } from './components';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(FormPanel).setPanelOptions((builder) => {
  return builder.addFieldNamePicker({
    path: 'name',
    name: 'Field name',
    description: 'Name of the field with data.',
  });
});
