import * as sinon from 'sinon';
import test from 'tape-catch';

test('stubbing', t => {
  const s = sinon.stub();
  stub: s() >> 42;
  t.ok(s() === 42);
  t.end();
});

test('mocking', t => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();
  obj.method();

  verify: mock;

  t.end();
});

test('failing verification', t => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();

  verify: mock;

  t.end();
});
