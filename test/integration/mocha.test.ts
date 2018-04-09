import { sync as run } from 'cross-spawn';
import { env } from 'process';

import {
  babelJitEnv,
  nodeModulesPath,
  requireBabelJitArgs,
  requireTypescriptJitArgs,
  resolvePath,
  typescriptJitEnv,
} from './utils';

const mochaCli = resolvePath(nodeModulesPath, 'mocha', 'bin', 'mocha');
const cwd = resolvePath('mocha');

test('produces correct output', () => {
  const { status, stdout } = run(
    'node',
    [
      mochaCli,
      ...requireBabelJitArgs,
      ...requireTypescriptJitArgs,
      '--reporter',
      'json',
      'mocha.js',
    ],
    {
      cwd,
      env: {
        ...env,
        ...babelJitEnv,
        ...typescriptJitEnv,
      },
    },
  );

  expect: status === 1;

  const {
    stats: { passes, failures },
    failures: [
      {
        err: { message },
      },
    ],
  } = JSON.parse(stdout.toString());

  expect: {
    passes === 1;
    failures === 1;
  }
  expect(message).toMatchSnapshot();
});
