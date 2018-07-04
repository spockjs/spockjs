import { transform } from '@babel/core';

import plugin from '@spockjs/babel-plugin-spock';
import { minimalConfig } from '@spockjs/config';

test('throws if the config contains no preset defining an interactionRuntimeAdapter', () => {
  expect(() =>
    transform(`stub: s() >> 42;`, {
      plugins: [[plugin, minimalConfig]],
      filename: 'test.js',
    }),
  ).toThrowErrorMatchingSnapshot();
});
