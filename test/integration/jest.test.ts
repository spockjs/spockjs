import { nodeModulesPath, resolvePath, runWithTypescriptJit } from './utils';

const jestCli = resolvePath(nodeModulesPath, 'jest-cli', 'bin', 'jest');
const cwd = resolvePath('jest');

test('produces correct output', () => {
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
