// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

import { matchers } from '@emotion/jest';
import { TextDecoder, TextEncoder } from 'util';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Fetch
 */
const fetchMock = () =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  });

global.fetch = jest.fn(fetchMock);

beforeEach(() => {
  global.fetch.mockImplementation(fetchMock);
});

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

beforeEach(() => {
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(global, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});
