import { PanelModel } from '@grafana/data';

import { PayloadMode } from './constants';
import { PanelOptions, RequestOptions } from './types';

/**
 * Outdated Request Options
 */
interface OutdatedRequestOptions extends RequestOptions {
  /**
   * Add only updated elements to payload
   *
   * Removed in 3.4.0
   */
  updatedOnly?: boolean;
}

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions {
  initial: OutdatedRequestOptions;
  update: OutdatedRequestOptions;
}

/**
 * Normalize Request Options
 */
const normalizeRequestOptions = ({ updatedOnly, payloadMode, ...actual }: OutdatedRequestOptions): RequestOptions => {
  return {
    ...actual,
    payloadMode: payloadMode ?? (updatedOnly ? PayloadMode.UPDATED : PayloadMode.ALL),
  };
};

/**
 * Get Migrated Options
 * @param panel
 */
export const getMigratedOptions = (panel: PanelModel<OutdatedPanelOptions & PanelOptions>): PanelOptions => {
  const { ...options } = panel.options;

  /**
   * Normalize request options
   */
  if ('updatedOnly' in options.initial || 'updatedOnly' in options.update) {
    options.initial = normalizeRequestOptions(options.initial);
    options.update = normalizeRequestOptions(options.update);
  }

  return options;
};
