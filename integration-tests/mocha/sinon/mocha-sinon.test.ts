import { resolve } from 'path';

import { runMocha } from '../mocha';

// mark implicit dependencies for jest
() => require('./workdir/mocha.js') && require('./workdir/package.json');
() => require('@spockjs/preset-sinon-mocks');

const cwd = resolve(__dirname, 'workdir');

test('interaction blocks work', () => {
  const {
    status,
    result: {
      stats: { passes, failures },
      failures: [
        {
          err: { message },
        },
      ],
    },
  } = runMocha(cwd);

  expect: status === 1;

  expect: {
    passes === 2;
    failures === 1;
  }
  expect(message).toMatchSnapshot();
});
