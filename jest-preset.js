const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  ...tsjPreset,
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  passWithNoTests: true,
  verbose: true,
};
