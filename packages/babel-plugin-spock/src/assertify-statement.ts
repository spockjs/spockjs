import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { addImport, findExistingImport } from '@spockjs/auto-import-assert';
import { InternalConfig } from '@spockjs/config';
import empowerAssert from '@spockjs/power-assert';
import checkStatically from '@spockjs/static-check';

export default (
  babel: { types: typeof BabelTypes },
  state: any,
  config: InternalConfig,
) => (statementPath: NodePath<BabelTypes.Statement>) => {
  const { types: t } = babel;
  const {
    assertFunctionName,
    autoImport,
    powerAssert,
    staticTruthCheck,
    hooks: { assertionPostProcessors },
  } = config;

  const { scope, node: statement } = statementPath;

  if (t.isExpressionStatement(statement)) {
    const expressionStatementPath = statementPath as NodePath<
      BabelTypes.ExpressionStatement
    >;
    const expressionPath = expressionStatementPath.get(
      'expression',
    ) as NodePath<BabelTypes.Expression>;
    if (staticTruthCheck) {
      checkStatically(expressionPath);
    }

    const origExpr = statement.expression;

    const assertIdentifier = t.identifier(
      autoImport
        ? // reuse or add import from given source
          findExistingImport(scope, t, autoImport) ||
          addImport(scope, t, autoImport, assertFunctionName, 'assert')
        : // assume assert identifier is already available
          assertFunctionName || 'assert',
    );
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

    const processedExpressionStatementPath = assertionPostProcessors.reduce(
      (path, postProcessAssertion) => postProcessAssertion(t, config, path),
      expressionStatementPath,
    );

    if (powerAssert) {
      empowerAssert(
        babel,
        state,
        assertIdentifier.name,
        processedExpressionStatementPath,
      );
    }
  } else {
    throw statementPath.buildCodeFrameError(
      `Expected an expression statement, but got a statement of type ${
        statementPath.type
      }`,
    );
  }
};
