test('stubbing', () => {
  const s = jest.fn();
  stub: s() >> 42;
  expect(s()).toBe(42);
});

test('mocking', () => {
  const mock = jest.fn();
  mock: 2 * mock();

  mock();
  mock();

  verify: mock;
});

test('failing verification', () => {
  const mock = jest.fn();
  mock: 2 * mock();

  mock();

  verify: mock;
});
