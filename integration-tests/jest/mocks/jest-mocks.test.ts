import { resolve } from 'path';

import { runJest } from '../jest';

// mark implicit dependencies for jest
() => require('./workdir/jest.js') && require('./workdir/package.json');
() => require('@spockjs/preset-runner-jest');
() => require('@spockjs/preset-jest-mocks');

const cwd = resolve(__dirname, 'workdir');

test('interaction blocks work', () => {
  const {
    status,
    result: {
      numPassedTests,
      numFailedTests,
      testResults: [{ message }],
    },
  } = runJest(cwd);

  expect: {
    status === 1;
    numPassedTests === 2;
    numFailedTests === 1;
  }
  expect(message).toMatchSnapshot();
});
