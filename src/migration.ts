import { PanelModel } from '@grafana/data';

import { FormElementType, PayloadMode } from './constants';
import { LayoutOptions, LayoutSection, PanelOptions, RequestOptions } from './types';

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
 * Outdated Layout Options
 */
interface OutdatedLayoutOptions extends Omit<LayoutOptions, 'sections'> {
  sections: Array<
    Omit<LayoutSection, 'id'> & {
      /**
       * ID
       * Optional to backward compatibility
       *
       * @type {string}
       */
      id?: string;
    }
  >;
}

/**
 * Outdated Panel Options
 */
interface OutdatedPanelOptions extends Omit<PanelOptions, 'initial' | 'update' | 'layout'> {
  initial: OutdatedRequestOptions;
  update: OutdatedRequestOptions;
  layout: OutdatedLayoutOptions;
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
export const getMigratedOptions = (panel: PanelModel<OutdatedPanelOptions>): PanelOptions => {
  const { ...options } = panel.options;

  if (!!options.elements?.length) {
    options.elements.forEach((element) => {
      if (element.type === FormElementType.DATETIME && !element.hasOwnProperty('isUseLocalTime')) {
        element.isUseLocalTime = false;
      }
    });
  }

  /**
   * Normalize request options
   */
  if ('updatedOnly' in options.initial || 'updatedOnly' in options.update) {
    options.initial = normalizeRequestOptions(options.initial);
    options.update = normalizeRequestOptions(options.update);
  }

  /**
   * Normalize layout sections
   */
  if (options.layout?.sections) {
    options.layout = {
      ...options.layout,
      sections: options.layout.sections.map(({ id, ...rest }) => ({
        ...rest,
        id: id ?? rest.name,
      })),
    } as LayoutOptions;
  }

  return options as PanelOptions;
};
