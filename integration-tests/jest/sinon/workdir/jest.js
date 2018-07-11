import * as sinon from 'sinon';

test('stubbing', () => {
  const s = sinon.stub();
  stub: s() >> 42;
  expect(s()).toBe(42);
});

test('mocking', () => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();
  obj.method();

  verify: mock;
});

test('failing verification', () => {
  const obj = { method: () => {} };

  const mock = sinon.mock(obj);
  mock: 2 * mock.method();

  obj.method();

  verify: mock;
});
