module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testRegex: '.*\\.(test|spec)\\.ts$',
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  moduleNameMapper: {
    // replace '@spockjs/*' with './packages/*/src'
    // required until https://github.com/facebook/jest/issues/2702 is fixed
    // solved differently in integration-tests and .babelrc:
    // `plugins: ["@spockjs/babel-plugin-spock/src/index.ts"]`
    '^@spockjs\\/([^/]+)': '<rootDir>/packages/$1/src',
  },
};
