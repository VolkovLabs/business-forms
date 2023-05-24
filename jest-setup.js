import '@testing-library/jest-dom';

/**
 * Fetch
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
