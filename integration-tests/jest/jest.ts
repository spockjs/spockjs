import { resolve } from 'path';

import { modulePath, runWithTypescriptJit } from '../utils';

const jestCli = resolve(modulePath('jest-cli'), 'bin', 'jest');

export const runJest = (cwd: string) => {
  const { status, stdout } = runWithTypescriptJit(
    [jestCli, '--no-cache', '--noStackTrace', '--runInBand', '--json'],
    { cwd },
  );

  return { status, result: JSON.parse(stdout.toString()) };
};
