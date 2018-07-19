import { transform, TransformOptions } from '@babel/core';
import assert, { AssertionError } from 'assert';

import plugin from '@spockjs/babel-plugin-spock';
import { minimalConfig } from '@spockjs/config';

const babelOpts: TransformOptions = {
  plugins: [[plugin, minimalConfig]],
  highlightCode: false,
  filename: 'test.js',
};

test('assertifies an "expect"-labeled expression statement', () => {
  const { code } = transform(`expect: 1 === 2;`, babelOpts);
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('assertifies a "then"-labeled expression statement', () => {
  const { code } = transform(`then: 1 === 2;`, babelOpts);
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('does not assertify a "when"-labeled expression statement', () => {
  const { code } = transform(`when: 1 === 2;`, babelOpts);
  expect(() => new Function('assert', code as string)(assert)).not.toThrow();
});

test('assertifies all expression statements in a labeled block statement', () => {
  const { code } = transform(
    `expect: {
      1 === 1;
      0.5 * 4 < 3;
      ((x, y) => x === y)(42, 42);
    }`,
    babelOpts,
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
    babelOpts,
  );
  expect(() => new Function('assert', code as string)(assert)).toThrow(
    AssertionError,
  );
});

test('throws if a statement is not an expression statement', () => {
  expect(() => transform(`expect: if(true);`, babelOpts)).toThrowError(
    /Expected an expression statement, but got a statement of type IfStatement/,
  );
});
