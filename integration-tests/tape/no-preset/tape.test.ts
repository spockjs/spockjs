import { resolve } from 'path';

import { runTape } from '../tape';

// mark implicit dependencies for jest
() => require('./workdir/tape.js') && require('./workdir/package.json');

const cwd = resolve(__dirname, 'workdir');

test('produces correct output', done => {
  runTape(cwd, (status, fail, [{ name }]) => {
    expect: {
      status === 1;
      fail === 1;
    }

    expect(name).toMatchSnapshot();

    done();
  });
});
