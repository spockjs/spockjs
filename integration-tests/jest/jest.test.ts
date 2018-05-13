import { resolve } from 'path';

import { runJest } from './jest';

// mark implicit dependencies for jest
() => require('./workdir/jest.js') && require('./workdir/package.json');

const cwd = resolve(__dirname, 'workdir');

test('produces slightly too verbose output by default', () => {
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
    numPassedTests === 1;
    numFailedTests === 1;
  }
  expect(message).toMatchSnapshot();
});
