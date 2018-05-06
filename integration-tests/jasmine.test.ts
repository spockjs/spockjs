import { sync as run } from 'cross-spawn';
import { unlinkSync as del, writeFileSync as write } from 'fs';
import { env } from 'process';

import {
  babelJitEnv,
  modulePath,
  resolvePath,
  typescriptJitEnv,
} from './utils';

// mark implicit dependencies for jest
() => require('./jasmine/jasmine.js') && require('./jasmine/package.json');

const jasmineCli = resolvePath(modulePath('jasmine'), 'bin', 'jasmine');
const cwd = resolvePath('jasmine');
const jasmineConfig = resolvePath(cwd, 'jasmine.json');

beforeAll(() => {
  write(
    jasmineConfig,
    JSON.stringify({
      spec_dir: '.',
      spec_files: ['jasmine.js'],
      helpers: [
        resolvePath(modulePath('@babel/register'), 'lib', 'node.js'),
        resolvePath(modulePath('ts-node'), 'register', 'index.js'),
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
