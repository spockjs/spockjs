import { sync as run } from 'cross-spawn';
import { env } from 'process';

import { nodeModulesPath, resolvePath, tsconfigPath } from './utils';

const mochaCli = resolvePath(nodeModulesPath, 'mocha', 'bin', 'mocha');
const cwd = resolvePath('mocha');

test('produces correct output', () => {
  const { status, stdout } = run(
    'node',
    [
      mochaCli,
      '--require',
      '@babel/register',
      '--require',
      'ts-node/register',
      '--reporter',
      'json',
      'mocha.js',
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
