import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from '@spockjs/config';
import empowerAssert from '@spockjs/power-assert';
import checkStatically from '@spockjs/static-check';

import generateAssertIdentifier from './generate-assert-identifier';

export default (
  babel: { types: typeof BabelTypes },
  state: any,
  config: InternalConfig,
) => (statementPath: NodePath<BabelTypes.Statement>) => {
  const { types: t } = babel;
  const { scope, node: statement } = statementPath;

  if (t.isExpressionStatement(statement)) {
    const expressionPath = statementPath.get('expression') as NodePath<
      BabelTypes.Expression
    >;
    if (config.staticTruthCheck) {
      checkStatically(expressionPath);
    }

    const origExpr = statement.expression;

    const assertIdentifier = generateAssertIdentifier(t, config)(scope);
    assertIdentifier.loc = {
      start: origExpr.loc.start,
      end: origExpr.loc.start,
    };

    const newExpr = t.callExpression(assertIdentifier, [origExpr]);
    newExpr.loc = origExpr.loc;
    statement.expression = newExpr;

    // register added import with scope so it is found for the next assertion
    // for some reason, this needs to happen after we have referenced the import
    // with our call expression, otherwise the import will be removed
    (scope.getProgramParent() as any).crawl();

    if (config.powerAssert) {
      empowerAssert(babel, state, assertIdentifier.name, statementPath);
    }
  } else {
    throw statementPath.buildCodeFrameError(
      `Expected an expression statement, but got a statement of type ${
        statementPath.type
      }`,
    );
  }
};
