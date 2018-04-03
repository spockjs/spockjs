import { sync as run } from 'cross-spawn';

import { env } from 'process';

import { nodeModulesPath, resolvePath, tsconfigPath } from './utils';

const jasmineCli = resolvePath(nodeModulesPath, 'jasmine', 'bin', 'jasmine');
const cwd = resolvePath('jasmine');

test('produces correct output', () => {
  const { status, stdout } = run('node', [jasmineCli], {
    cwd,
    env: {
      ...env,
      JASMINE_CONFIG_PATH: 'jasmine.json',
      TS_NODE_PROJECT: tsconfigPath,
      BABEL_DISABLE_CACHE: '1',
    },
  });

  expect: status === 1;
  expect(stdout.toString().replace(/Stack:.*/s, '')).toMatchSnapshot();
});
