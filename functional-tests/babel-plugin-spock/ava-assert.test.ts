import { transform } from '@babel/core';
import assert, { AssertionError } from 'power-assert';

import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

// mark implicit dependencies for jest
() => require('@spockjs/runner-ava');

test('works with t.truthy instead of assert', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [
      [
        plugin,
        { ...minimalConfig, presets: ['@spockjs/runner-ava'] } as Config,
      ],
    ],
  });
  expect(() => new Function('t', code as string)({ truthy: assert })).toThrow(
    AssertionError,
  );
});
