import { CallExpression } from '@babel/types';

import { AssertionPostProcessor } from '@spockjs/config/src/hooks';

const processor: AssertionPostProcessor = (t, config, path) => {
  const assertionExpression = path.node.expression as CallExpression;

  const tTruthy = t.memberExpression(t.identifier('t'), t.identifier('truthy'));
  tTruthy.loc = tTruthy.object.loc = tTruthy.property.loc =
    assertionExpression.callee.loc;
  // When espower "purifies" ASTs internally to match against the patterns,
  // our MemberExpression retains an `optional: undefined` property,
  // which the pattern does not have, preventing it from being matched.
  delete (tTruthy as any).optional;

  assertionExpression.callee = tTruthy;
  return { path, patterns: ['t.truthy(value)'] };
};

export default processor;

// TODO func test
