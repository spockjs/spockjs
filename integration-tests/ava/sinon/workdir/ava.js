import test from 'ava';
import * as sinon from 'sinon';

test('stubbing', t => {
  const s = sinon.stub();
  stub: s() >> 42;
  t.truthy(s() === 42);
});

test('mocking', t => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();
  obj.method();

  verify: mock;
});

test('failing verification', t => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();

  verify: mock;
});
