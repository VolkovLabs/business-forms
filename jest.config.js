// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

const defaultConfig = require('./.config/jest.config');

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...defaultConfig,
  transform: {
    ...defaultConfig.transform,
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        /**
         * Override sourceMaps with inline to see the correct coverage lines
         */
        sourceMaps: 'inline',
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
            dynamicImport: true,
          },
        },
      },
    ],
  },
};
