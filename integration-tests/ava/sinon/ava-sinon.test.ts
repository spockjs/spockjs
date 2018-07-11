import { resolve } from 'path';

import { runAva } from '../ava';

// mark implicit dependencies for jest
() => require('./workdir/ava.js') && require('./workdir/package.json');
() => require('@spockjs/preset-runner-ava');
() => require('@spockjs/preset-sinon-mocks');

const cwd = resolve(__dirname, 'workdir');

test('interaction blocks work', () => {
  const { status, stdout } = runAva(cwd);

  expect: status === 1;
  expect(
    stdout.replace(/^.+\.(j|t)s(:[0-9]+){1,2}.*(\r\n|\r|\n)/gm, ''),
  ).toMatchSnapshot();
});
