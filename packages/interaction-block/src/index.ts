import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from '@spockjs/config';

import parseInteractionDeclaration from './parser';

export default (t: typeof BabelTypes, config: InternalConfig) => {
  const processors = config.hooks.interactionProcessors.map(processor =>
    processor(t, config),
  );
  if (!processors.some(({ primary }) => primary)) {
    throw new Error(
      'Found an interaction declaration, but no preset defines a primary interactionProcessor.\n' +
        'You need to enable a preset for your mocking library.',
    );
  }

  return {
    declare: (statementPath: NodePath<BabelTypes.Statement>) => {
      if (statementPath.isExpressionStatement()) {
        const expressionPath = statementPath.get('expression') as NodePath<
          BabelTypes.Expression
        >;

        if (expressionPath.isBinaryExpression()) {
          const declaration = parseInteractionDeclaration(expressionPath);
          statementPath.replaceWithMultiple(
            processors.map(({ declare }) => declare(declaration)),
          );
        } else {
          throw expressionPath.buildCodeFrameError(
            `Expected a binary expression, but got an expression of type ${
              expressionPath.type
            }`,
          );
        }
      } else {
        throw statementPath.buildCodeFrameError(
          `Expected an expression statement, but got a statement of type ${
            statementPath.type
          }`,
        );
      }
    },

    verify: (statementPath: NodePath<BabelTypes.Statement>) => {
      if (statementPath.isExpressionStatement()) {
        statementPath.replaceWithMultiple(
          processors.map(({ verify }) => verify(statementPath.node.expression)),
        );
      } else {
        throw statementPath.buildCodeFrameError(
          `Expected an expression statement, but got a statement of type ${
            statementPath.type
          }`,
        );
      }
    },
  };
};

export const declarationLabels = ['stub', 'mock'];
export const verificationLabel = 'verify';
