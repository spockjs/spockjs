import { sync as run } from 'cross-spawn';
import { readFileSync as read, unlinkSync as del } from 'fs';
import { resolve } from 'path';

import {
  modulePath,
  requireBabelJitArgs,
  runWithTypescriptJit,
} from '../utils';

// mark implicit dependencies for jest
() =>
  require('./workdir/codemod.js') &&
  require('./workdir/config.json') &&
  require('./workdir/package.json');

const babelCli = resolve(modulePath('@babel/cli'), 'bin', 'babel');
const cwd = resolve(__dirname, 'workdir');
const babelConfig = resolve(cwd, 'config.json');
const inFile = resolve(cwd, 'codemod.js');
const outFile = resolve(cwd, 'codemod.out.js');

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
    /AssertionError \[ERR_ASSERTION\]: \(3 === 4\) is not truthy/,
  );
});
