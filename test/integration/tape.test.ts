import { sync as run } from 'cross-spawn';
import { env } from 'process';
import TapParser from 'tap-parser';

import { nodeModulesPath, resolvePath, tsconfigPath } from './utils';

const tapeCli = resolvePath(nodeModulesPath, 'tape', 'bin', 'tape');
const cwd = resolvePath('tape');

test('produces correct output', done => {
  const { status, stdout } = run(
    'node',
    [
      tapeCli,
      '--require',
      '@babel/register',
      '--require',
      'ts-node/register',
      'tape.js',
    ],
    {
      cwd,
      env: {
        ...env,
        TS_NODE_PROJECT: tsconfigPath,
        BABEL_DISABLE_CACHE: '1',
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
