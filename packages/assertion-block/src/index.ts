import print from '@babel/generator';
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
) => {
  const { types: t } = babel;
  const {
    assertFunctionName,
    autoImport,
    powerAssert,
    staticTruthCheck,
    hooks: { assertionPostProcessors },
  } = config;
  const postProcessors = assertionPostProcessors.map(processor =>
    processor(t, config),
  );

  return (statementPath: NodePath<BabelTypes.Statement>) => {
    if (statementPath.isExpressionStatement()) {
      const { scope, node: statement } = statementPath;

      if (staticTruthCheck) {
        checkStatically(statementPath.get('expression') as NodePath<
          BabelTypes.Expression
        >);
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

      const newExpr = t.callExpression(assertIdentifier, [
        origExpr,
        t.stringLiteral(`(${print(origExpr).code}) is not truthy`),
      ]);
      newExpr.loc = origExpr.loc;
      statement.expression = newExpr;

      // register added import with scope so it is found for the next assertion
      // for some reason, this needs to happen after we have referenced the import
      // with our call expression, otherwise the import will be removed
      (scope.getProgramParent() as any).crawl();

      const {
        path: processedExpressionStatementPath,
        patterns,
      } = postProcessors.reduce(
        ({ path, patterns }, postProcess) => postProcess(path, patterns),
        {
          path: statementPath,
          patterns: [`${assertIdentifier.name}(value, [message])`],
        },
      );

      if (powerAssert) {
        empowerAssert(babel, state, patterns, processedExpressionStatementPath);
      }
    } else {
      throw statementPath.buildCodeFrameError(
        `Expected an expression statement, but got a statement of type ${
          statementPath.type
        }`,
      );
    }
  };
};

export const labels = ['expect', 'then'];
