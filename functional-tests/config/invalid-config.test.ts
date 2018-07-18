import { transform } from '@babel/core';
import plugin from '@spockjs/babel-plugin-spock';

test('throws if the config contains an unknown key', () => {
  expect(() =>
    transform(`expect: 1 === 1;`, {
      plugins: [[plugin, { asdf: true }]],
      filename: 'test.js',
    }),
  ).toThrowErrorMatchingSnapshot();
});

test('throws if the config contains an invalid data type', () => {
  expect(() =>
    transform(`expect: 1 === 1;`, {
      plugins: [[plugin, { powerAssert: 42 }]],
      filename: 'test.js',
    }),
  ).toThrowErrorMatchingSnapshot();
});
