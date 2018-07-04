import { InteractionVerificationPostProcessor } from '@spockjs/config';

const processor: InteractionVerificationPostProcessor = (t, config) => () =>
  t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier('t'), t.identifier('pass')),
      [],
    ),
  );

export default processor;
