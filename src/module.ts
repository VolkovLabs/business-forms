import { PanelPlugin } from '@grafana/data';
import { AbcPanel } from './components';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(AbcPanel).setPanelOptions((builder) => {
  return builder.addFieldNamePicker({
    path: 'name',
    name: 'Field name',
    description: 'Name of the field with data.',
  });
});
