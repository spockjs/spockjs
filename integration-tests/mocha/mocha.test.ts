import { sync as run } from 'cross-spawn';
import { resolve } from 'path';
import { env } from 'process';

import {
  babelJitEnv,
  modulePath,
  requireBabelJitArgs,
  requireTypescriptJitArgs,
  typescriptJitEnv,
} from '../utils';

// mark implicit dependencies for jest
() => require('./workdir/mocha.js') && require('./workdir/package.json');

const mochaCli = resolve(modulePath('mocha'), 'bin', 'mocha');
const cwd = resolve(__dirname, 'workdir');

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
