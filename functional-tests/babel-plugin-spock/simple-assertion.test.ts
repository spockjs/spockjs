import { transform } from '@babel/core';
import { minimalConfig } from '@spockjs/config';

import plugin from '@spockjs/babel-plugin-spock';

test('assertifies an "expect"-labeled expression statement', () => {
  const { code } = transform(`expect: 1 === 1;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(code).toMatchSnapshot();
});

test('assertifies a "then"-labeled expression statement', () => {
  const { code } = transform(`then: 1 === 1;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(code).toMatchSnapshot();
});

test('does not assertify a "when"-labeled expression statement', () => {
  const { code } = transform(`when: 1 === 1;`, {
    plugins: [[plugin, minimalConfig]],
  });
  expect(code).toMatchSnapshot();
});

test('assertifies all expression statements in a labeled block statement', () => {
  const { code } = transform(
    `expect: {
      1 === 1;
      0.5 * 4 < 3;
      abc.xyz() === 'result';
      ((x, y) => x === y)(42, 42);
    }`,
    {
      plugins: [[plugin, minimalConfig]],
    },
  );
  expect(code).toMatchSnapshot();
});

test('assertifies inside an if / else statement', () => {
  const { code } = transform(
    `if(1 < 2) {
      expect: 1 < 2;
    }
    else {
      expect: 1 >= 2;
    }`,
    {
      plugins: [[plugin, minimalConfig]],
    },
  );
  expect(code).toMatchSnapshot();
});

test('throws if a statement is not an expression statement', () => {
  expect(() =>
    transform(`expect: if(true);`, {
      plugins: [[plugin, minimalConfig]],
      highlightCode: false,
    }),
  ).toThrowErrorMatchingSnapshot();
});
