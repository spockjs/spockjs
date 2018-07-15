import { transform, TransformOptions } from '@babel/core';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('@spockjs/preset-jest-mocks');

const babelOpts: TransformOptions = {
  plugins: [
    [
      plugin,
      {
        ...minimalConfig,
        presets: ['@spockjs/preset-jest-mocks'],
      } as Config,
    ],
  ],
  filename: 'test.js',
};

test('reports too few calls', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 2 * mock();

    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('reports no calls at all', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('reports too many calls', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 0 * mock();

    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('does not accept a call with missing arguments', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock(42);

    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('does not accept a call with incorrect arguments', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock(42);

    mock(1337);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('does not throw if the calls were correct', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 2 * mock(42);

    mock(42);
    mock(42);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).not.toThrowError();
});

test('does not care about unspecified calls', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock(42);

    mock(42);
    mock(1337);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).not.toThrowError();
});

test('does not care about mocks without interaction declarations', () => {
  const { code } = transform(
    `const mock = jest.fn();

    mock(42);
    mock(1337);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).not.toThrowError();
});

test('reports too few calls with one of multiple argument lists', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 2 * mock();
    mock: 2 * mock(42);

    mock();
    mock();
    mock(42);

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('works with a member expression mock', () => {
  const { code } = transform(
    `const mock = { method: jest.fn() };
    mock: 2 * mock.method();

    mock.method();

    verify: mock.method;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('works with a computed mock object', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 2 * mock();

    mock();

    verify: 0 || mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('throws if the callee in an interaction declaration is not a Jest mock function', () => {
  const { code } = transform(
    `const fn = () => {};
    mock: 2 * fn();`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('throws if the value in an interaction verification is not a Jest mock function', () => {
  const { code } = transform(
    `const fn = () => {};
    verify: fn;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});
