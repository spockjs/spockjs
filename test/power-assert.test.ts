import { transform } from 'babel-core-old';

import plugin from '../src';

test('prints a nice error for an "expected"-labeled expression statement', () => {
  const { code } = transform(
    `import assert from 'power-assert';
    expect: 1 === 2;`,
    {
      plugins: [plugin],
      presets: ['env'],
    },
  );

  expect(() =>
    new Function('require', code as string)(require),
  ).toThrowErrorMatchingSnapshot();
});

test('passes a truthy expression', () => {
  const { code } = transform(
    `import assert from 'power-assert';
    expect: 2 === 2;`,
    {
      plugins: [plugin],
      presets: ['env'],
    },
  );

  expect(() => new Function('require', code as string)(require)).not.toThrow();
});

test('leaves unrelated assert statements untouched', () => {
  const { code } = transform(
    `import assert from 'power-assert';
    assert(1 === 2);`,
    {
      plugins: [plugin],
      presets: ['env'],
    },
  );

  expect(code).toMatchSnapshot();
});

test('still works if babel-plugin-espower is used for other assertions in the file', () => {
  const { code } = transform(
    `import assert from 'power-assert';
    assert(x >= 0);
    expect: x > 0;`,
    {
      plugins: [plugin, 'espower'],
      presets: ['env'],
    },
  );

  expect(() =>
    new Function('require', 'x', code as string)(require, 1),
  ).not.toThrow();
  expect(() =>
    new Function('require', 'x', code as string)(require, 0),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    new Function('require', 'x', code as string)(require, -1),
  ).toThrowErrorMatchingSnapshot();
});

test('supports non-standard JSX syntax', () => {
  const createElement = jest
    .fn()
    .mockImplementationOnce(tagName => ({ prop: tagName }));

  const { code } = transform(
    `import assert from 'power-assert';
    expect: (<div></div>).prop === 'expected';`,
    {
      plugins: [plugin],
      presets: ['env', 'react'],
    },
  );

  expect(() =>
    new Function('require', 'React', code as string)(require, {
      createElement,
    }),
  ).toThrowErrorMatchingSnapshot();
});
