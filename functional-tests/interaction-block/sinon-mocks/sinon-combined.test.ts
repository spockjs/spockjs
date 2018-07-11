import { transform, TransformOptions } from '@babel/core';
import * as sinon from 'sinon';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('@spockjs/preset-sinon-mocks');

const babelOpts: TransformOptions = {
  parserOpts: { allowReturnOutsideFunction: true },
  plugins: [
    [
      plugin,
      {
        ...minimalConfig,
        presets: ['@spockjs/preset-sinon-mocks'],
      } as Config,
    ],
  ],
  filename: 'test.js',
};

test('reports too few calls', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method('a') >> 1337;
    mock: 2 * mock.method() >> 42;
    mock: 2 * mock.method() >> 43;

    obj.method();
    obj.method('a');
    obj.method();
    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('returns the values associated with the correct calls', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method('a') >> 1337;
    mock: 2 * mock.method() >> 42;
    mock: 2 * mock.method() >> 43;

    const one = obj.method();
    const two = obj.method('a');
    const three = obj.method();
    const four = obj.method();

    return [one, two, three, four];`,
    babelOpts,
  );
  expect(new Function('sinon', code as string)(sinon)).toEqual([
    42,
    1337,
    42,
    43,
  ]);
});

test('reports too few calls with a function expectation', () => {
  const { code } = transform(
    `const mock = sinon.mock('mock');
    mock: 2 * mock() >> 42;

    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('returns the correct value with a function expectation', () => {
  const { code } = transform(
    `const mock = sinon.mock('mock');
    mock: 2 * mock() >> 42;

    return mock();`,
    babelOpts,
  );
  expect(new Function('sinon', code as string)(sinon)).toEqual(42);
});
