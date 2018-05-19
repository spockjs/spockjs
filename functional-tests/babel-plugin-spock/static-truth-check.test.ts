import { transform } from '@babel/core';
import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

test('throws if an expression can be inferred to always be truthy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      const x = 1;
      expect: x === 1;`,
      {
        plugins: [
          [plugin, { ...minimalConfig, staticTruthCheck: true } as Config],
        ],
        highlightCode: false,
      },
    ),
  ).toThrowErrorMatchingSnapshot();
});

test('throws if an expression can be inferred to always be falsy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      const x = 0;
      expect: x === 1;`,
      {
        plugins: [
          [plugin, { ...minimalConfig, staticTruthCheck: true } as Config],
        ],
        highlightCode: false,
      },
    ),
  ).toThrowErrorMatchingSnapshot();
});

test('does not throw if an expression may or may not be truthy', () => {
  expect(() =>
    transform(
      `import assert from 'power-assert';
      import sut from './sut';
      expect: sut() === 42;`,
      {
        plugins: [
          [plugin, { ...minimalConfig, staticTruthCheck: true } as Config],
        ],
      },
    ),
  ).not.toThrowError();
});
