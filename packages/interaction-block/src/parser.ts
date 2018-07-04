import { NodePath } from '@babel/traverse';
import { BinaryExpression, Expression, Node } from '@babel/types';
import {
  BaseInteractionDeclaration,
  CombinedInteractionDeclaration,
  InteractionDeclaration,
  MockInteractionDeclaration,
  StubInteractionDeclaration,
} from '@spockjs/config';

const mockOperator = '*';
const stubOperator = '>>';

type InteractionDeclarationParser<
  E extends Node,
  I extends BaseInteractionDeclaration
> = (expressionPath: NodePath<E>) => I;

const parseCall: InteractionDeclarationParser<
  Expression,
  BaseInteractionDeclaration
> = (expressionPath: NodePath) => {
  if (expressionPath.isCallExpression()) {
    const {
      node: { callee: mockObject, arguments: args },
    } = expressionPath;
    return {
      mockObject,
      args,
    };
  }
  throw expressionPath.buildCodeFrameError(
    `Expected a call expression, but got an expression of type ${
      expressionPath.type
    }`,
  );
};

const parseMockInteractionDeclaration: InteractionDeclarationParser<
  BinaryExpression,
  MockInteractionDeclaration
> = expressionPath => ({
  ...parseCall(expressionPath.get('right') as NodePath<Expression>),
  kind: 'mock',
  cardinality: expressionPath.node.left,
});

const parseStubInteractionDeclaration: InteractionDeclarationParser<
  BinaryExpression,
  StubInteractionDeclaration | CombinedInteractionDeclaration
> = expressionPath => {
  const leftPath = expressionPath.get('left') as NodePath<Expression>;
  const {
    node: { right: returnValue },
  } = expressionPath;

  if (leftPath.isBinaryExpression()) {
    const {
      node: { operator },
    } = leftPath;
    if (operator === mockOperator) {
      return {
        ...parseMockInteractionDeclaration(leftPath),
        returnValue,
        kind: 'combined',
      };
    }
    throw new Error(
      `Expected operator '${mockOperator}' (for combined mocking and stubbing), ` +
        `but got operator '${operator}'`,
    );
  }

  return {
    ...parseCall(leftPath),
    returnValue,
    kind: 'stub',
  };
};

const parseInteractionDeclaration: InteractionDeclarationParser<
  BinaryExpression,
  InteractionDeclaration
> = expressionPath => {
  const { node: expression } = expressionPath;
  const { operator } = expression;

  switch (operator) {
    case mockOperator:
      return parseMockInteractionDeclaration(expressionPath);
    case stubOperator:
      return parseStubInteractionDeclaration(expressionPath);
    default:
      throw expressionPath.buildCodeFrameError(
        `Expected operator '${mockOperator}' (for mocking) ` +
          `or '${stubOperator}' (for stubbing), ` +
          `but got operator '${operator}'`,
      );
  }
};

export default parseInteractionDeclaration;
