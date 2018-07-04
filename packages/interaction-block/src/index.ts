import { addNamed } from '@babel/helper-module-imports';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from '@spockjs/config';

import parseInteractionDeclaration from './parser';

export default (t: typeof BabelTypes, config: InternalConfig) => {
  const {
    hooks: { interactionRuntimeAdapter, interactionVerificationPostProcessors },
  } = config;
  const postProcessors = interactionVerificationPostProcessors.map(processor =>
    processor(t, config),
  );

  if (!interactionRuntimeAdapter) {
    throw new Error(
      'Found an interaction declaration, but no preset defines an interaction runtime adapter.\n' +
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
          const interactionDeclaration = parseInteractionDeclaration(
            expressionPath,
          );

          // serialize interaction declaration to object properties

          let interactionDeclarationProperties = [
            t.objectProperty(
              t.identifier('kind'),
              t.stringLiteral(interactionDeclaration.kind),
            ),
            t.objectProperty(
              t.identifier('args'),
              t.arrayExpression(interactionDeclaration.args),
            ),
          ];

          const { mockObject } = interactionDeclaration;
          if (t.isMemberExpression(mockObject)) {
            interactionDeclarationProperties = [
              ...interactionDeclarationProperties,
              t.objectProperty(t.identifier('mockObject'), mockObject.object),
              t.objectProperty(
                t.identifier('methodName'),
                mockObject.computed
                  ? mockObject.property
                  : t.stringLiteral(
                      (mockObject.property as BabelTypes.Identifier).name,
                    ),
              ),
            ];
          } else {
            interactionDeclarationProperties = [
              ...interactionDeclarationProperties,
              t.objectProperty(t.identifier('mockObject'), mockObject),
            ];
          }

          // kinds
          if (
            interactionDeclaration.kind === 'mock' ||
            interactionDeclaration.kind === 'combined'
          ) {
            interactionDeclarationProperties = [
              ...interactionDeclarationProperties,
              t.objectProperty(
                t.identifier('cardinality'),
                interactionDeclaration.cardinality,
              ),
            ];
          }
          if (
            interactionDeclaration.kind === 'stub' ||
            interactionDeclaration.kind === 'combined'
          ) {
            interactionDeclarationProperties = [
              ...interactionDeclarationProperties,
              t.objectProperty(
                t.identifier('returnValue'),
                interactionDeclaration.returnValue,
              ),
            ];
          }

          statementPath.replaceWith(
            t.callExpression(
              addNamed(
                statementPath,
                'declare',
                interactionRuntimeAdapter,
              ) as BabelTypes.Expression,
              [t.objectExpression(interactionDeclarationProperties)],
            ),
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
        statementPath.replaceWithMultiple([
          t.callExpression(
            addNamed(
              statementPath,
              'verify',
              interactionRuntimeAdapter,
            ) as BabelTypes.Expression,
            [statementPath.node.expression],
          ),
          ...postProcessors.map(postProcess =>
            postProcess(statementPath.node.expression),
          ),
        ]);
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
