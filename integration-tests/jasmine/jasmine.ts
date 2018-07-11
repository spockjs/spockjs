import { sync as run } from 'cross-spawn';
import { unlinkSync as del, writeFileSync as write } from 'fs';
import { resolve } from 'path';
import { env } from 'process';

import { babelJitEnv, modulePath, typescriptJitEnv } from '../utils';

export default (cwd: string) => {
  const config = resolve(cwd, 'jasmine.json');

  return {
    writeConfig: () =>
      write(
        config,
        JSON.stringify({
          spec_dir: '.',
          spec_files: ['jasmine.js'],
          helpers: [
            resolve(modulePath('@babel/register'), 'lib', 'node.js'),
            resolve(modulePath('ts-node'), 'register', 'index.js'),
          ],
          random: false,
        }),
      ),

    deleteConfig: () => del(config),

    run: () =>
      run('node', [resolve(modulePath('jasmine'), 'bin', 'jasmine')], {
        cwd,
        env: {
          ...env,
          ...babelJitEnv,
          ...typescriptJitEnv,
          JASMINE_CONFIG_PATH: 'jasmine.json',
        },
      }),
  };
};
