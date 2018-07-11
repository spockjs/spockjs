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

const mochaCli = resolve(modulePath('mocha'), 'bin', 'mocha');

export const runMocha = (cwd: string) => {
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

  return { status, result: JSON.parse(stdout.toString()) };
};
