import { resolve } from 'path';

import { runAva } from '../ava';

// mark implicit dependencies for jest
() => require('./workdir/ava.js') && require('./workdir/package.json');
() => require('@spockjs/preset-runner-ava');

const cwd = resolve(__dirname, 'workdir');

test('produces clean output with runner-ava preset', () => {
  const { status, stdout } = runAva(cwd);

  expect: status === 1;
  expect(
    stdout.replace(
      /Object\.<anonymous> \(.+(:[0-9]+){2}\)/,
      'Object.<anonymous> (LOCATION HIDDEN)',
    ),
  ).toMatchSnapshot();
});
