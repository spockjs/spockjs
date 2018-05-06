import { modulePath, resolvePath, runWithTypescriptJit } from './utils';

// mark implicit dependencies for jest
() => require('./ava/ava.js') && require('./ava/package.json');

const avaCli = resolvePath(modulePath('ava'), 'cli.js');
const cwd = resolvePath('ava');

test('produces correct output', () => {
  const { status, stderr } = runWithTypescriptJit(
    [avaCli, '--serial', '--no-cache', '--verbose'],
    { cwd },
  );

  expect: status === 1;
  expect(
    stderr.toString().replace(/✔|√|✖|×/g, ' '), // remove OS-dependent symbols
  ).toMatchSnapshot();
});
