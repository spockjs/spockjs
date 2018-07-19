import { transform, TransformOptions } from '@babel/core';
import assert, { AssertionError } from 'power-assert';

import { Config, minimalConfig } from '@spockjs/config';

import autoImportDisabled from '@spockjs/assertion-post-processor-regular-errors/src/auto-import-disabled-warning';

import plugin from '@spockjs/babel-plugin-spock';

// mark implicit dependencies for jest
() => require('@spockjs/preset-runner-jest');

const config: Config = {
  ...minimalConfig,
  presets: ['@spockjs/preset-runner-jest'],
};
const babelOpts = (config: Config) =>
  ({
    plugins: [[plugin, config]],
    filename: 'test.js',
  } as TransformOptions);

const originalConsoleWarn = console.warn;
let consoleWarn: jest.Mock;
beforeEach(() => (console.warn = consoleWarn = jest.fn()));
afterEach(() => (console.warn = originalConsoleWarn));

test('throws plain Errors instead of AssertionErrors', () => {
  const { code } = transform(`expect: 1 === 2;`, babelOpts(config));

  expect.assertions(1);
  try {
    new Function('assert', 'AssertionError', code as string)(
      assert,
      AssertionError,
    );
  } catch (e) {
    expect: !(e instanceof AssertionError);
    expect(e).toMatchSnapshot();
  }
});

test('leaves other errors untouched', () => {
  class CustomError extends Error {}
  const throws = () => {
    throw new CustomError();
  };
  const { code } = transform(`expect: throws() === 1;`, babelOpts(config));

  expect(() => {
    new Function('assert', 'AssertionError', 'throws', code as string)(
      assert,
      AssertionError,
      throws,
    );
  }).toThrow(CustomError);
});

describe('autoImport disabled warning', () => {
  beforeEach(() => (autoImportDisabled.warned = false));

  test('warns about the need to import AssertionError', () => {
    transform(`expect: 1 === 2;`, babelOpts(config));

    expect(consoleWarn.mock.calls).toMatchSnapshot();
  });

  test('warns only once in spite of multiple traversals and assertions', () => {
    const doTransform = () =>
      transform(
        `expect: 1 === 2;
        expect: 2 === 3;`,
        babelOpts(config),
      );
    doTransform();
    doTransform();

    expect(consoleWarn).toHaveBeenCalledTimes(1);
  });
});

test('does not require AssertionError in scope with autoImport enabled', () => {
  const { code } = transform(
    `expect: 1 === 2;`,
    babelOpts({ ...config, autoImport: true }),
  );

  expect.assertions(1);
  try {
    new Function('require', code as string)(require);
  } catch (e) {
    expect: !(e instanceof AssertionError);
    expect(e).toMatchSnapshot();
  }
});

test('keeps the pretty error message from powerAssert', () => {
  const { code } = transform(
    `expect: 1 === 2;`,
    babelOpts({ ...config, powerAssert: true }),
  );

  expect.assertions(1);
  try {
    new Function('assert', 'AssertionError', code as string)(
      assert,
      AssertionError,
    );
  } catch (e) {
    expect: !(e instanceof AssertionError);
    expect(e).toMatchSnapshot();
  }
});
