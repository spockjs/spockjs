import { resolve } from 'path';

import { runTape } from '../tape';

// mark implicit dependencies for jest
() => require('./workdir/tape.js') && require('./workdir/package.json');
() => require('@spockjs/preset-sinon-mocks');

const cwd = resolve(__dirname, 'workdir');

test('interaction blocks work', done => {
  runTape(cwd, (status, fail, [{ name }]) => {
    expect: {
      status === 1;
      fail === 1;
    }

    expect(name).toMatchSnapshot();

    done();
  });
});
