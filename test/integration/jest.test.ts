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

// specific to windows or timing
const removeVolatileElements = (output: string) =>
  output
    .replace(/ \..+jest\.js/, ' PATH_HIDDEN/jest.js')
    .replace(/. successful test/g, '  successful test')
    .replace(/. failing test/g, '  failing test')
    .replace(/ \(\d*\.?\d+m?s\)/g, '')
    .replace(/Time:\s+\d.*\n/, 'TIME HIDDEN\n');

// tests
test('produces correct output', () => {
  const result = run(
    tsNode,
    [
      '--project',
      tsconfig,
      jestCli,
      '--no-cache',
      '--noStackTrace',
      '--runInBand',
    ],
    { cwd },
  );

  expect(result.status).toBe(1);
  expect(removeVolatileElements(result.output.toString())).toMatchSnapshot();
});
