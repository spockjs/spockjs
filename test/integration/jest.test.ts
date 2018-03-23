import { sync as run } from 'cross-spawn';
import * as path from 'path';

// paths
const resolvePath = path.resolve.bind(path, __dirname);

const root = resolvePath('..', '..');
const tsconfig = resolvePath(root, 'tsconfig.json');

const nodeModules = resolvePath(root, 'node_modules');
const tsNode = resolvePath(nodeModules, '.bin', 'ts-node');
const jestCli = resolvePath(nodeModules, 'jest-cli', 'bin', 'jest');

const cwd = resolvePath('jest');

// tests
test('produces correct output', () => {
  const { status, stdout } = run(
    tsNode,
    [
      '--project',
      tsconfig,
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
