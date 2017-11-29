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

  expect.assertions(1);
  try {
    new Function('require', code as string)(require);
  } catch (err) {
    expect(err.message).toMatchSnapshot();
  }
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

  expect(() =>
    new Function('require', code as string).bind(null, require),
  ).not.toThrow();
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

  expect.assertions(3);

  expect(() =>
    new Function('require', 'x', code as string).bind(null, require, 1),
  ).not.toThrow();
  try {
    new Function('require', 'x', code as string)(require, 0);
  } catch (err) {
    expect(err.message).toMatchSnapshot();
  }
  try {
    new Function('require', 'x', code as string)(require, -1);
  } catch (err) {
    expect(err.message).toMatchSnapshot();
  }
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

  expect.assertions(1);
  try {
    new Function('require', 'React', code as string)(require, {
      createElement,
    });
  } catch (err) {
    expect(err.message).toMatchSnapshot();
  }
});
