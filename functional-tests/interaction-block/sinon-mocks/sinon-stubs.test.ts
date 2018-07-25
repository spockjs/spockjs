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

test('stubs without parameters', () => {
  const { code } = transform(
    `const s = sinon.stub();
    stub: s() >> 42;
    return s();`,
    babelOpts,
  );
  expect(new Function('sinon', 'require', code as string)(sinon, require)).toBe(
    42,
  );
});

test('matches the stub call with the correct arguments', () => {
  const { code } = transform(
    `const s = sinon.stub();
    stub: {
      s('a', 'b') >> 41;
      s('b', 'c') >> 42;
      s('b', 'c', 'd') >> 43;
    }
    return s('b', 'c');`,
    babelOpts,
  );
  expect(new Function('sinon', 'require', code as string)(sinon, require)).toBe(
    42,
  );
});

test('does not match a stub call with missing arguments', () => {
  const { code } = transform(
    `const s = sinon.stub();
    stub: s('a') >> 42;
    return s();`,
    babelOpts,
  );
  expect(
    new Function('sinon', 'require', code as string)(sinon, require),
  ).toBeUndefined();
});

test('does not match a stub call with incorrect arguments', () => {
  const { code } = transform(
    `const s = sinon.stub();
    stub: s('a') >> 42;
    return s('b');`,
    babelOpts,
  );
  expect(
    new Function('sinon', 'require', code as string)(sinon, require),
  ).toBeUndefined();
});
