import { sync as run } from 'cross-spawn';

import { env } from 'process';

import {
  babelJitEnv,
  nodeModulesPath,
  resolvePath,
  typescriptJitEnv,
} from './utils';

const jasmineCli = resolvePath(nodeModulesPath, 'jasmine', 'bin', 'jasmine');
const cwd = resolvePath('jasmine');

test('produces correct output', () => {
  const { status, stdout } = run('node', [jasmineCli], {
    cwd,
    env: {
      ...env,
      ...babelJitEnv,
      ...typescriptJitEnv,
      JASMINE_CONFIG_PATH: 'jasmine.json',
    },
  });

  expect: status === 1;
  expect(stdout.toString().replace(/Stack:.*/s, '')).toMatchSnapshot();
});
