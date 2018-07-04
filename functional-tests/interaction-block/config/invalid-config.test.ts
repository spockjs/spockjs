import { transform } from '@babel/core';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('./preset-auxiliary-interaction-processor');
const presetAuxiliaryInteractionProcessor = require.resolve(
  './preset-auxiliary-interaction-processor',
);

test('throws if the config contains no preset defining a primary interaction processor', () => {
  expect(() =>
    transform(`stub: s() >> 42;`, {
      plugins: [
        [
          plugin,
          {
            ...minimalConfig,
            presets: [presetAuxiliaryInteractionProcessor],
          } as Config,
        ],
      ],
      filename: 'test.js',
    }),
  ).toThrowErrorMatchingSnapshot();
});
