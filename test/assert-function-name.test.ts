import { transform } from '@babel/core';

import plugin from '../src';
import { Config, minimalConfig } from '../src/config';

test('generates specified assert function', () => {
  const { code } = transform(`expect: 1 === 1;`, {
    plugins: [
      [plugin, { ...minimalConfig, assertFunctionName: 'check' } as Config],
    ],
  });
  expect(code).toMatchSnapshot();
});

test('generates import with specified name when autoImport is set', () => {
  const { code } = transform(`expect: 1 === 1;`, {
    plugins: [
      [
        plugin,
        {
          ...minimalConfig,
          assertFunctionName: 'check',
          autoImport: true,
        } as Config,
      ],
    ],
  });
  expect(code).toMatchSnapshot();
});
