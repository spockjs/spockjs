import { transform } from '@babel/core';

import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

// mark implicit dependencies for jest
() => require('@spockjs/preset-runner-ava');
() => require('../interaction-block/preset-noop-interaction-processor');

const presetNoopInteractionProcessor = require.resolve(
  '../interaction-block/preset-noop-interaction-processor',
);

test('runs t.pass() for each mock verification', () => {
  const { code } = transform(
    `const m = {};
    const m2 = {};

    stub: m() >> 42;
    mock: 0 * m2();

    verify: {
      m;
      m2;
    }`,
    {
      plugins: [
        [
          plugin,
          {
            ...minimalConfig,
            presets: [
              '@spockjs/preset-runner-ava',
              presetNoopInteractionProcessor,
            ],
          } as Config,
        ],
      ],
      filename: 'test.js',
    },
  );

  const pass = jest.fn();
  new Function('t', code as string)({ pass });
  expect(pass).toHaveBeenCalledTimes(2);
});
