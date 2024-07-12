// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...require('./.config/jest.config'),

  /**
   * Reset mocks implementation between tests
   */
  resetMocks: true,

  /**
   * Randomize the order of the tests to exclude dependencies between tests
   */
  randomize: true,
};
