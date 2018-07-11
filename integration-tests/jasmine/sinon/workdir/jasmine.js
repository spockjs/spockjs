import * as sinon from 'sinon';

describe('jasmine interaction blocks', () => {
  it('stubbing', () => {
    const s = sinon.stub();
    stub: s() >> 42;
    expect(s()).toBe(42);
  });

  it('mocking', () => {
    const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method();

    obj.method();
    obj.method();

    verify: mock;
  });

  it('failing verification', () => {
    const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method();

    obj.method();

    verify: mock;
  });
});
