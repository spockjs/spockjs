import { sync as run } from 'cross-spawn';
import { env } from 'process';
import TapParser from 'tap-parser';

import {
  babelJitEnv,
  modulePath,
  requireBabelJitArgs,
  requireTypescriptJitArgs,
  resolvePath,
  typescriptJitEnv,
} from './utils';

// mark implicit dependencies for jest
() => require('./tape/tape.js') && require('./tape/package.json');

const tapeCli = resolvePath(modulePath('tape'), 'bin', 'tape');
const cwd = resolvePath('tape');

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
