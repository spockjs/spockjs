import { resolve } from 'path';

import { modulePath, runWithTypescriptJit } from '../utils';

const avaCli = resolve(modulePath('ava'), 'cli.js');

export const runAva = (cwd: string) => {
  const { status, stderr } = runWithTypescriptJit(
    [avaCli, '--serial', '--no-cache', '--verbose'],
    { cwd },
  );

  return {
    status,
    stderr: stderr
      .toString()
      .replace(/✔|√|✖|×/g, ' ') // remove OS-dependent symbols
      .replace(/[^ ]+ava\.js:/, '<FILEPATH HIDDEN>:'), // remove absolute path
  };
};
