import { addNamed } from '@babel/helper-module-imports';
import template from '@babel/template';
import { NodePath } from '@babel/traverse';
import { ExpressionStatement, TryStatement } from '@babel/types';

import { AssertionPostProcessor } from '@spockjs/config/src/hooks';

import autoImportDisabled from './auto-import-disabled-warning';

const createTryStatement = template(`
  try {
    ASSERTION
  } catch(e) {
    if (e instanceof ASSERTION_ERROR) {
      throw new Error(e.message);
    }
    throw e;
  }
`);

const processor: AssertionPostProcessor = (t, { autoImport }, originalPath) => {
  const assertionErrorImportedName = 'AssertionError';
  const assertionErrorLocal = autoImport
    ? addNamed(originalPath, assertionErrorImportedName, autoImport)
    : t.identifier(assertionErrorImportedName);
  if (!autoImport && !autoImportDisabled.warned) {
    console.warn(
      'Generating catch clauses to intercept AssertionErrors ' +
        'with autoImport disabled. The AssertionError class must be imported ' +
        `and available in scope as \`${assertionErrorImportedName}\``,
    );
    autoImportDisabled.warned = true;
  }

  const { node: assertionNode } = originalPath;
  const tryStatement = createTryStatement({
    ASSERTION: assertionNode,
    ASSERTION_ERROR: assertionErrorLocal,
  }) as TryStatement;

  originalPath.replaceWith(tryStatement);
  const tryPath = (originalPath as any) as NodePath<TryStatement>;

  // set some loc info so test runners can tell the user where an error comes from
  tryPath.traverse({
    ThrowStatement(path) {
      path.node.loc = {
        start: assertionNode.loc.end,
        end: assertionNode.loc.end,
      };
    },
  });

  // return the original assertion ExpressionStatement
  return tryPath.get('block.body.0') as NodePath<ExpressionStatement>;
};

export default processor;
