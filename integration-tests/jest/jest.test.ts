import { resolve } from 'path';

import { modulePath, runWithTypescriptJit } from '../utils';

// mark implicit dependencies for jest
() => require('./workdir/jest.js') && require('./workdir/package.json');

const jestCli = resolve(modulePath('jest-cli'), 'bin', 'jest');
const cwd = resolve(__dirname, 'workdir');

test('produces slightly too verbose output by default', () => {
  const { status, stdout } = runWithTypescriptJit(
    [jestCli, '--no-cache', '--noStackTrace', '--runInBand', '--json'],
    { cwd },
  );

  expect: status === 1;

  const {
    numPassedTests,
    numFailedTests,
    testResults: [{ message }],
  } = JSON.parse(stdout.toString());

  expect: {
    numPassedTests === 1;
    numFailedTests === 1;
  }
  expect(message).toMatchSnapshot();
});
