import { transform } from '@babel/core';
import plugin from '@spockjs/babel-plugin-spock';

() => require('../interaction-block/preset-noop-interaction-runtime-adapter');
const presetNoopInteractionRuntimeAdapter = require.resolve(
  '../interaction-block/preset-noop-interaction-runtime-adapter',
);

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

test('throws if the config contains multiple presets with interactionRuntimeAdapters', () => {
  expect(() =>
    transform(`stub: s() >> 42;`, {
      plugins: [
        [
          plugin,
          {
            presets: [
              presetNoopInteractionRuntimeAdapter,
              presetNoopInteractionRuntimeAdapter,
            ],
          },
        ],
      ],
      filename: 'test.js',
    }),
  ).toThrowErrorMatchingSnapshot();
});
