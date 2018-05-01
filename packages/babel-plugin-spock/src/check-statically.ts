import { NodePath } from '@babel/traverse';
import { Expression } from '@babel/types';

import { InternalConfig } from '@spockjs/config';

export default (
  expressionPath: NodePath<Expression>,
  { staticTruthCheck }: InternalConfig,
) => {
  if (!staticTruthCheck) return;

  const truthy: boolean | undefined = expressionPath.evaluateTruthy();

  if (truthy !== undefined) {
    throw expressionPath.buildCodeFrameError(
      `Expression statement in assertion is always ${
        truthy ? 'truthy' : 'falsy'
      }`,
    );
  }
};
