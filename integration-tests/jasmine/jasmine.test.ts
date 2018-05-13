import { sync as run } from 'cross-spawn';
import { unlinkSync as del, writeFileSync as write } from 'fs';
import { resolve } from 'path';
import { env } from 'process';

import { babelJitEnv, modulePath, typescriptJitEnv } from '../utils';

// mark implicit dependencies for jest
() => require('./workdir/jasmine.js') && require('./workdir/package.json');

const jasmineCli = resolve(modulePath('jasmine'), 'bin', 'jasmine');
const cwd = resolve(__dirname, 'workdir');
const jasmineConfig = resolve(cwd, 'jasmine.json');

beforeAll(() => {
  write(
    jasmineConfig,
    JSON.stringify({
      spec_dir: '.',
      spec_files: ['jasmine.js'],
      helpers: [
        resolve(modulePath('@babel/register'), 'lib', 'node.js'),
        resolve(modulePath('ts-node'), 'register', 'index.js'),
      ],
      random: false,
    }),
  );
});

afterAll(() => del(jasmineConfig));

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
