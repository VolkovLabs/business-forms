// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';

/**
 * Fetch
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
