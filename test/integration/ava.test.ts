import { sync as run } from 'cross-spawn';

import {
  nodeModulesPath,
  resolvePath,
  tsconfigPath,
  tsNodePath,
} from './utils';

const avaCli = resolvePath(nodeModulesPath, 'ava', 'cli.js');
const cwd = resolvePath('ava');

test('produces correct output', () => {
  const { status, stderr } = run(
    tsNodePath,
    ['--project', tsconfigPath, avaCli, '--serial', '--no-cache', '--verbose'],
    { cwd },
  );

  expect(status).toBe(1);
  expect(
    stderr.toString().replace(/✔|√|✖|×/g, ' '), // remove OS-dependent symbols
  ).toMatchSnapshot();
});
