import { sync as run } from 'cross-spawn';
import { env } from 'process';

import {
  babelJitEnv,
  modulePath,
  requireBabelJitArgs,
  requireTypescriptJitArgs,
  resolvePath,
  typescriptJitEnv,
} from './utils';

// mark implicit dependencies for jest
() => require('./mocha/mocha.js') && require('./mocha/package.json');

const mochaCli = resolvePath(modulePath('mocha'), 'bin', 'mocha');
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
