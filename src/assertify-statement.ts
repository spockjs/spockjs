import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from './config';
import generateAssertIdentifier from './generate-assert-identifier';

export default (t: typeof BabelTypes, config: InternalConfig) => (
  statementPath: NodePath<BabelTypes.Statement>,
) => {
  const statement = statementPath.node;
  if (t.isExpressionStatement(statement)) {
    const origExpr = statement.expression;

    const assertIdentifier = generateAssertIdentifier(t, config)(
      statementPath.scope,
    );
    assertIdentifier.loc = {
      start: origExpr.loc.start,
      end: origExpr.loc.start,
    };

    const newExpr = t.callExpression(assertIdentifier, [origExpr]);
    newExpr.loc = origExpr.loc;
    statement.expression = newExpr;
  } else {
    throw statementPath.buildCodeFrameError(
      `Expected an expression statement, but got a statement of type ${
        statementPath.type
      }`,
    );
  }
};
