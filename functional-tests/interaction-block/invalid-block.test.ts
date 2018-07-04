import { transform, TransformOptions } from '@babel/core';

import plugin from '@spockjs/babel-plugin-spock';
import { Config, minimalConfig } from '@spockjs/config';

// mark implicit dependency for jest
() => require('./preset-noop-interaction-runtime-adapter');
const presetNoopInteractionRuntimeAdapter = require.resolve(
  './preset-noop-interaction-runtime-adapter',
);

const babelOpts: TransformOptions = {
  plugins: [
    [
      plugin,
      {
        ...minimalConfig,
        presets: [presetNoopInteractionRuntimeAdapter],
      } as Config,
    ],
  ],
  highlightCode: false,
  filename: 'test.js',
};

test('throws if a verification is not an expression statement', () => {
  expect(() => transform(`verify: if(true);`, babelOpts)).toThrowError(
    /Expected an expression statement, but got a statement of type IfStatement/,
  );
});

test('throws if a declaration is not an expression statement', () => {
  expect(() => transform(`stub: if(true);`, babelOpts)).toThrowError(
    /Expected an expression statement, but got a statement of type IfStatement/,
  );
});

test('throws if a declaration is a non-binary expression statement', () => {
  expect(() => transform(`stub: 42;`, babelOpts)).toThrowError(
    /Expected a binary expression, but got an expression of type NumericLiteral/,
  );
});

test('throws if a declaration does not have a function call', () => {
  expect(() => transform(`stub: asdf >> 42;`, babelOpts)).toThrowError(
    /Expected a call expression, but got an expression of type Identifier/,
  );
});

test('throws if a declaration has a binary expression with the wrong operator', () => {
  expect(() => transform(`stub: asdf() + 42;`, babelOpts)).toThrowError(
    /Expected operator '\*' \(for mocking\) or '>>' \(for stubbing\), but got operator '\+'/,
  );
});

test('throws if a combined declaration has a nested binary expression with the wrong operator', () => {
  expect(() => transform(`stub: 1 + asdf() >> 42;`, babelOpts)).toThrowError(
    /Expected operator '\*' \(for combined mocking and stubbing\), but got operator '\+'/,
  );
});
