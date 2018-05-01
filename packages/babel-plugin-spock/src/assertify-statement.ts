import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from '@spockjs/config';

import createEspowerVisitor from 'babel-plugin-espower/create';

import checkStatically from './check-statically';
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
    checkStatically(expressionPath, config);

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
      // Now let espower generate nice power assertions for this assertion
      createEspowerVisitor(babel, {
        embedAst: true,
        patterns: [`${assertIdentifier.name}(value)`],
      }).visitor.Program(statementPath, state);
    }
  } else {
    throw statementPath.buildCodeFrameError(
      `Expected an expression statement, but got a statement of type ${
        statementPath.type
      }`,
    );
  }
};
