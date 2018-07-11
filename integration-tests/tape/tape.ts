import { sync as run } from 'cross-spawn';
import { resolve } from 'path';
import { env } from 'process';
import TapParser from 'tap-parser';

import {
  babelJitEnv,
  modulePath,
  requireBabelJitArgs,
  requireTypescriptJitArgs,
  typescriptJitEnv,
} from '../utils';

const tapeCli = resolve(modulePath('tape'), 'bin', 'tape');

export const runTape = (
  cwd: string,
  cb: (status: number, fail: number, failures: any) => void,
) => {
  const { status, stdout } = run(
    'node',
    [tapeCli, ...requireBabelJitArgs, ...requireTypescriptJitArgs, 'tape.js'],
    {
      cwd,
      env: {
        ...env,
        ...babelJitEnv,
        ...typescriptJitEnv,
      },
    },
  );

  // no assertion on pass count possible at the moment,
  // will be 0 because tape only reports assertions, not test cases
  new TapParser(({ fail, failures }) => cb(status, fail, failures)).end(stdout);
};
