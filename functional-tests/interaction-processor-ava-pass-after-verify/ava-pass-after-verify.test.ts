import { transform } from '@babel/core';

import { Config, minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

// mark implicit dependencies for jest
() => require('@spockjs/preset-runner-ava');
() => require('../interaction-block/preset-noop-interaction-runtime-adapter');

const presetNoopInteractionRuntimeAdapter = require.resolve(
  '../interaction-block/preset-noop-interaction-runtime-adapter',
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
              presetNoopInteractionRuntimeAdapter,
            ],
          } as Config,
        ],
      ],
      filename: 'test.js',
    },
  );

  const pass = jest.fn();
  new Function('t', 'require', code as string)({ pass }, require);
  expect(pass).toHaveBeenCalledTimes(2);
});
