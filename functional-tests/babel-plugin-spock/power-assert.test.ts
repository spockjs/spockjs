import { transform } from '@babel/core';
import assert from 'power-assert';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

test('prints a nice error for an "expected"-labeled expression statement', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
    filename: 'test.js',
  });

  expect(() =>
    new Function('assert', code as string)(assert),
  ).toThrowErrorMatchingSnapshot();
});

test('passes a truthy expression', () => {
  const { code } = transform(`expect: 2 === 2;`, {
    plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
    filename: 'test.js',
  });

  expect(() => new Function('assert', code as string)(assert)).not.toThrow();
});

test('leaves unrelated assert statements untouched', () => {
  const { code } = transform(`assert(1 === 2);`, {
    plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
    filename: 'test.js',
  });

  expect(() =>
    new Function('assert', code as string)(assert),
  ).toThrowErrorMatchingSnapshot();
});

test('still works if babel-plugin-espower is used for other assertions in the file', () => {
  const { code } = transform(
    `assert(x >= 0);
    expect: x > 0;`,
    {
      plugins: [
        [plugin, { ...minimalConfig, powerAssert: true } as Config],
        'babel-plugin-espower',
      ],
      filename: 'test.js',
    },
  );

  expect(() =>
    new Function('assert', 'x', code as string)(assert, 1),
  ).not.toThrow();
  expect(() =>
    new Function('assert', 'x', code as string)(assert, 0),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    new Function('assert', 'x', code as string)(assert, -1),
  ).toThrowErrorMatchingSnapshot();
});

test('supports non-standard JSX syntax', () => {
  const createElement = jest
    .fn()
    .mockImplementationOnce(tagName => ({ prop: tagName }));

  const { code } = transform(`expect: (<div></div>).prop === 'expected';`, {
    plugins: [[plugin, { ...minimalConfig, powerAssert: true } as Config]],
    presets: ['@babel/preset-react'],
    filename: 'test.js',
  });

  expect(() =>
    new Function('assert', 'React', code as string)(assert, {
      createElement,
    }),
  ).toThrowErrorMatchingSnapshot();
});

test('works when using autoImport', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [plugin, '@babel/plugin-transform-modules-commonjs'],
    filename: 'test.js',
  });

  expect(() =>
    new Function('require', code as string)(require),
  ).toThrowErrorMatchingSnapshot();
});
