import { resolve } from 'path';

import { modulePath, runWithTypescriptJit } from '../utils';

// mark implicit dependencies for jest
() => require('./workdir/ava.js') && require('./workdir/package.json');

const avaCli = resolve(modulePath('ava'), 'cli.js');
const cwd = resolve(__dirname, 'workdir');

test('produces correct output', () => {
  const { status, stderr } = runWithTypescriptJit(
    [avaCli, '--serial', '--no-cache', '--verbose'],
    { cwd },
  );

  expect: status === 1;
  expect(
    stderr
      .toString()
      .replace(/✔|√|✖|×/g, ' ') // remove OS-dependent symbols
      .replace(/[^ ]+ava\.js:/, '<FILEPATH HIDDEN>:'), // remove absolute path
  ).toMatchSnapshot();
});
