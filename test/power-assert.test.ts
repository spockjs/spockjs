import { transform } from '@babel/core';

import plugin from '../src';
import { Config, minimalConfig } from '../src/config';

test('prints a nice error for an "expected"-labeled expression statement', () => {
  const { code } = transform(
    `const assert = require('power-assert');
    expect: 1 === 2;`,
    {
      plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
      filename: 'test.js',
    },
  );

  expect(() =>
    new Function('require', code as string)(require),
  ).toThrowErrorMatchingSnapshot();
});

test('passes a truthy expression', () => {
  const { code } = transform(
    `const assert = require('power-assert');
    expect: 2 === 2;`,
    {
      plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
      filename: 'test.js',
    },
  );

  expect(() => new Function('require', code as string)(require)).not.toThrow();
});

test('leaves unrelated assert statements untouched', () => {
  const { code } = transform(
    `const assert = require('power-assert');
    assert(1 === 2);`,
    {
      plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
      filename: 'test.js',
    },
  );

  expect(code).toMatchSnapshot();
});

test('still works if babel-plugin-espower is used for other assertions in the file', () => {
  const { code } = transform(
    `const assert = require('power-assert');
    assert(x >= 0);
    expect: x > 0;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, powerAssert: true } as Config],
        'espower',
      ],
      filename: 'test.js',
    },
  );

  expect(() =>
    new Function('require', 'x', code as string)(require, 1),
  ).not.toThrow();
  expect(() =>
    new Function('require', 'x', code as string)(require, 0),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    new Function('require', 'x', code as string)(require, -1),
  ).toThrowErrorMatchingSnapshot();
});

test('supports non-standard JSX syntax', () => {
  const createElement = jest
    .fn()
    .mockImplementationOnce(tagName => ({ prop: tagName }));

  const { code } = transform(
    `const assert = require('power-assert');
    expect: (<div></div>).prop === 'expected';`,
    {
      plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
      presets: ['@babel/preset-react'],
      filename: 'test.js',
    },
  );

  expect(() =>
    new Function('require', 'React', code as string)(require, {
      createElement,
    }),
  ).toThrowErrorMatchingSnapshot();
});

test('works when using autoImport', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [[plugin]],
    presets: ['@babel/preset-env'],
    filename: 'test.js',
  });

  expect(() =>
    new Function('require', code as string)(require),
  ).toThrowErrorMatchingSnapshot();
});
