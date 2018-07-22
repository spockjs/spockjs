module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  testRunner: 'jest-circus/runner',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testRegex: '.*\\.(test|spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
};
