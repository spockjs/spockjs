import { NodePath } from '@babel/traverse';
import { Expression } from '@babel/types';

export default (expressionPath: NodePath<Expression>) => {
  const truthy: boolean | undefined = expressionPath.evaluateTruthy();

  if (truthy !== undefined) {
    throw expressionPath.buildCodeFrameError(
      `Expression statement in assertion is always ${
        truthy ? 'truthy' : 'falsy'
      }`,
    );
  }
};
