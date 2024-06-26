// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

import { matchers } from '@emotion/jest';
import { TextDecoder, TextEncoder } from 'util';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Fetch
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

/**
 * Mock ResizeObserver
 */
global.ResizeObserver = ResizeObserver;

/**
 * Assign Text Decoder and Encoder which are required in @grafana/ui
 */
Object.assign(global, { TextDecoder, TextEncoder });

/**
 * Add @emotion matchers
 */
expect.extend(matchers);
