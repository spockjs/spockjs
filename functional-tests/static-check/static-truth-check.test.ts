import { transform, TransformOptions } from '@babel/core';
import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

const babelOpts: TransformOptions = {
  plugins: [[plugin, { ...minimalConfig, staticTruthCheck: true } as Config]],
  highlightCode: false,
  filename: 'test.js',
};

test('throws if an expression can be inferred to always be truthy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      const x = 1;
      expect: x === 1;`,
      babelOpts,
    ),
  ).toThrowError(/always truthy/);
});

test('throws if an expression can be inferred to always be falsy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      const x = 0;
      expect: x === 1;`,
      babelOpts,
    ),
  ).toThrowError(/always falsy/);
});

test('does not throw if an expression may or may not be truthy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      import sut from './sut';
      expect: sut() === 42;`,
      babelOpts,
    ),
  ).not.toThrow();
});
