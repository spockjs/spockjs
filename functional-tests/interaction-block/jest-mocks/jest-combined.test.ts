import { transform, TransformOptions } from '@babel/core';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('@spockjs/preset-jest-mocks');

const babelOpts: TransformOptions = {
  parserOpts: { allowReturnOutsideFunction: true },
  plugins: [
    [
      plugin,
      {
        ...minimalConfig,
        presets: ['@spockjs/preset-jest-mocks'],
      } as Config,
    ],
  ],
  filename: 'test.js',
};

test('reports too few calls', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock('a') >> 1337;
    mock: 4 * mock() >> 42;

    mock();
    mock('a');
    mock();
    mock();

    verify: mock;`,
    babelOpts,
  );
  expect(() =>
    new Function('jest', 'require', code as string)(jest, require),
  ).toThrowErrorMatchingSnapshot();
});

test('returns the values associated with the correct calls', () => {
  const { code } = transform(
    `const mock = jest.fn();
    mock: 1 * mock('a') >> 1337;
    mock: 4 * mock() >> 42;

    const one = mock();
    const two = mock('a');
    const three = mock();
    const four = mock();

    return [one, two, three, four];`,
    babelOpts,
  );
  expect(
    new Function('jest', 'require', code as string)(jest, require),
  ).toEqual([42, 1337, 42, 42]);
});
