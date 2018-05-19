import { transform } from '@babel/core';
import assert, { AssertionError } from 'assert';

import plugin from '@spockjs/babel-plugin-spock';
import { minimalConfig } from '@spockjs/config';

test('assertifies an "expect"-labeled expression statement', () => {
  const { code } = transform(`expect: 1 === 2;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('assertifies a "then"-labeled expression statement', () => {
  const { code } = transform(`then: 1 === 2;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('does not assertify a "when"-labeled expression statement', () => {
  const { code } = transform(`when: 1 === 2;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(() => new Function('assert', code as string)(assert)).not.toThrow();
});

test('assertifies all expression statements in a labeled block statement', () => {
  const { code } = transform(
    `expect: {
      1 === 1;
      0.5 * 4 < 3;
      ((x, y) => x === y)(42, 42);
    }`,
    {
      plugins: [[plugin, minimalConfig]],
    },
  );

  const customAssert = jest.fn(assert);
  new Function('assert', code as string)(customAssert);
  expect(customAssert).toHaveBeenCalledTimes(3);
});

test('assertifies inside an if / else statement', () => {
  const { code } = transform(
    `if(1 < 2) {
      expect: false;
    }
    else {
      expect: true;
    }`,
    { plugins: [[plugin, minimalConfig]] },
  );
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('throws if a statement is not an expression statement', () => {
  expect(() =>
    transform(`expect: if(true);`, {
      plugins: [[plugin, minimalConfig]],
      highlightCode: false,
    }),
  ).toThrowErrorMatchingSnapshot();
});
