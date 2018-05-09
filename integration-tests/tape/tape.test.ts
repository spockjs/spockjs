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

// mark implicit dependencies for jest
() => require('./workdir/tape.js') && require('./workdir/package.json');

const tapeCli = resolve(modulePath('tape'), 'bin', 'tape');
const cwd = resolve(__dirname, 'workdir');

test('produces correct output', done => {
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

  expect: status === 1;

  new TapParser(({ fail, failures: [{ name }] }) => {
    expect: {
      fail === 1;
      // no assertion on pass count
      // it will be 0 because tape only reports assertions, not test cases
    }
    expect(name).toMatchSnapshot();
    done();
  }).end(stdout);
});
