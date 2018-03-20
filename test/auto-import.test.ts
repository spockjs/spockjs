import { transform } from '@babel/core';

import plugin from '../src';
import { Config } from '../src/config';

test('imports from power-assert by default', () => {
  const { code } = transform(`expect: 1 === 1;`, {
    plugins: [[plugin, { powerAssert: false } as Config]],
  });
  expect(code).toMatchSnapshot();
});

test('does not clash with an existing "_assert" import', () => {
  const { code } = transform(
    `import _assert from 'fancy-assert';
    expect: 1 === 1;`,
    { plugins: [[plugin, { powerAssert: false } as Config]] },
  );
  expect(code).toMatchSnapshot();
});

test('does not clash with an existing "_assert" identifier in another scope after adding an import', () => {
  const { code } = transform(
    `expect: 1 === 1;
    {
      let _assert;
      expect: 2 === 2;
    }`,
    { plugins: [[plugin, { powerAssert: false } as Config]] },
  );
  expect(code).toMatchSnapshot();
});

test('imports from a custom source', () => {
  const { code } = transform(`expect: 1 === 1;`, {
    plugins: [
      [plugin, { powerAssert: false, autoImport: 'fancy-assert' } as Config],
    ],
  });
  expect(code).toMatchSnapshot();
});

test('uses an existing default import', () => {
  const { code } = transform(
    `import fancyAssert from 'power-assert';
    expect: 1 === 1;`,
    { plugins: [[plugin, { powerAssert: false } as Config]] },
  );
  expect(code).toMatchSnapshot();
});

test('does not attempt to use an existing named import', () => {
  const { code } = transform(
    `import { fancyAssert } from 'power-assert';
    expect: 1 === 1;`,
    { plugins: [[plugin, { powerAssert: false } as Config]] },
  );
  expect(code).toMatchSnapshot();
});

test('does not attempt to use a shadowed existing default import', () => {
  const { code } = transform(
    `import fancyAssert from 'power-assert';
    {
      let fancyAssert;
      expect: 1 === 1;
    }`,
    { plugins: [[plugin, { powerAssert: false } as Config]] },
  );
  expect(code).toMatchSnapshot();
});

test('reuses the same import for multiple assertions', () => {
  const { code } = transform(
    `expect: 1 === 1;
    expect: 2 === 2;`,
    {
      plugins: [[plugin, { powerAssert: false } as Config]],
    },
  );
  expect(code).toMatchSnapshot();
});

test('does not break preset-env module transform and generates code runnable in node', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [[plugin, { powerAssert: false } as Config]],
    presets: ['@babel/preset-env'],
  });
  expect(() =>
    new Function('require', code as string)(require),
  ).toThrowErrorMatchingSnapshot();
});
