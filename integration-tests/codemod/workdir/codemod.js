import * as sinon from 'sinon';
import { env } from 'process';

const { suite } = env;

if (suite === 'assertion') {
  expect: 1 === 1;

  expect: {
    2 === 2;
    3 === 4;
  }
}

if (suite === 'interaction') {
  const obj = { method: () => {} };
  const m = sinon.mock(obj);

  mock: 2 * m.method();

  obj.method();

  verify: m;
}
