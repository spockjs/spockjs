import { transform, TransformOptions } from '@babel/core';
import * as sinon from 'sinon';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('@spockjs/preset-sinon-mocks');

const babelOpts: TransformOptions = {
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
    mock: 2 * mock.method();

    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('reports no calls at all', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('reports too many calls', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 0 * mock.method();

    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('does not accept a call with missing arguments', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method(42);

    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('does not accept a call with incorrect arguments', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method(42);

    obj.method(1337);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('does not throw if the calls were correct', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method(42);

    obj.method(42);
    obj.method(42);

    verify: mock;`,
    babelOpts,
  );
  expect(() => new Function('sinon', code as string)(sinon)).not.toThrowError();
});

test('does not care about unspecified methods', () => {
  const { code } = transform(
    `const obj = { method: () => {}, other: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method(42);

    obj.method(42);
    obj.other();

    verify: mock;`,
    babelOpts,
  );
  expect(() => new Function('sinon', code as string)(sinon)).not.toThrowError();
});

test('reports the occurrence of an unspecified call', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 1 * mock.method(42);

    obj.method(42);
    obj.method(1337);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('reports too few calls on one of multiple methods', () => {
  const { code } = transform(
    `const obj = { method: () => {}, other: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method();
    mock: 2 * mock.other();

    obj.method();
    obj.method();
    obj.other();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('reports too few calls with one of multiple argument lists', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method();
    mock: 2 * mock.method(42);

    obj.method();
    obj.method();
    obj.method(42);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('reports too few calls on one of multiple identical interactions', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock.method();
    mock: 2 * mock.method();

    obj.method();
    obj.method();
    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('works with a computed method name', () => {
  const { code } = transform(
    `const obj = { method: () => {} };

    const mock = sinon.mock(obj);
    mock: 2 * mock['method']();

    obj.method();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});

test('works with a function expectation', () => {
  const { code } = transform(
    `const mock = sinon.mock('mock');
    mock: 2 * mock();

    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('sinon', code as string)(sinon),
  ).toThrowErrorMatchingSnapshot();
});
