import { sync as run } from 'cross-spawn';

import {
  nodeModulesPath,
  resolvePath,
  tsconfigPath,
  tsNodePath,
} from './utils';

const jestCli = resolvePath(nodeModulesPath, 'jest-cli', 'bin', 'jest');
const cwd = resolvePath('jest');

test('produces correct output', () => {
  const { status, stdout } = run(
    tsNodePath,
    [
      '--project',
      tsconfigPath,
      jestCli,
      '--no-cache',
      '--noStackTrace',
      '--runInBand',
      '--json',
    ],
    { cwd },
  );

  expect(status).toBe(1);

  const result = JSON.parse(stdout.toString());
  expect(result.numPassedTests).toBe(1);
  expect(result.numFailedTests).toBe(1);
  expect(result.testResults[0].message).toMatchSnapshot();
});
