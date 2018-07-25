import { resolve } from 'path';

import { runMocha } from '../mocha';

// mark implicit dependencies for jest
() => require('./workdir/mocha.js') && require('./workdir/package.json');

const cwd = resolve(__dirname, 'workdir');

test('produces correct output', () => {
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
    passes === 1;
    failures === 1;
  }
  expect(message).toMatchSnapshot();
});
