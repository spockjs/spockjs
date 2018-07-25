import assert from 'assert';
import * as sinon from 'sinon';

specify('stubbing', () => {
  const s = sinon.stub();
  stub: s() >> 42;
  assert(s() === 42);
});

specify('mocking', () => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();
  obj.method();

  verify: mock;
});

specify('failing verification', () => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();

  verify: mock;
});
