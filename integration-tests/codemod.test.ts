import { sync as run } from 'cross-spawn';
import { readFileSync as read, unlinkSync as del } from 'fs';

import {
  modulePath,
  requireBabelJitArgs,
  resolvePath,
  runWithTypescriptJit,
} from './utils';

// mark implicit dependencies for jest
() =>
  require('./codemod/codemod.js') &&
  require('./codemod/config.json') &&
  require('./codemod/package.json');

const babelCli = resolvePath(modulePath('@babel/cli'), 'bin', 'babel');
const cwd = resolvePath('codemod');
const babelConfig = resolvePath(cwd, 'config.json');
const inFile = resolvePath(cwd, 'codemod.js');
const outFile = resolvePath(cwd, 'codemod.out.js');

beforeAll(() => {
  const { status } = runWithTypescriptJit(
    [
      babelCli,
      '--no-babelrc',
      '--config-file',
      babelConfig,
      '-o',
      outFile,
      inFile,
    ],
    { cwd },
  );
  if (status) throw 'babel codemod exited with status ' + status;
});

afterAll(() => del(outFile));

test('generates code that looks hand-written', () => {
  expect(read(outFile).toString()).toMatchSnapshot();
});

test('generates code that performs the assertion', () => {
  const { status, stderr } = run('node', [...requireBabelJitArgs, outFile], {
    cwd,
  });

  expect: status === 1;
  expect(stderr.toString()).toMatch(
    /AssertionError \[ERR_ASSERTION\]: false == true/,
  );
});
