const baseConfig = require('@aws-cdk/cdk-build-tools/config/jest.config');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...baseConfig,
  coverageReporters: ["html"],

  // Different than usual
  testMatch: [
    '<rootDir>/**/aws-ecs-patterns/test/**/?(*.)+(test).ts',
  ],

  coverageThreshold: {
    global: {
      branches: 35,
      statements: 55,
    },
  },
};
