import { sync as run } from 'cross-spawn';
import { readFileSync as read, unlinkSync as del } from 'fs';

import {
  nodeModulesPath,
  resolvePath,
  tsconfigPath,
  tsNodePath,
} from './utils';

const babelCli = resolvePath(nodeModulesPath, '@babel', 'cli', 'bin', 'babel');
const cwd = resolvePath('codemod');
const babelConfig = resolvePath(cwd, 'config.json');
const inFile = resolvePath(cwd, 'codemod.js');
const outFile = resolvePath(cwd, 'codemod.out.js');

beforeAll(() => {
  const { status } = run(
    tsNodePath,
    [
      '--project',
      tsconfigPath,
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
  const { status, stderr } = run(
    'node',
    ['--require', '@babel/register', outFile],
    { cwd },
  );

  expect: status === 1;
  expect(stderr.toString()).toMatch(
    /AssertionError \[ERR_ASSERTION\]: false == true/,
  );
});
