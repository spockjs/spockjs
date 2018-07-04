import { InteractionProcessor } from '@spockjs/config';

const processor: InteractionProcessor = (t, config) => ({
  primary: false,

  declare: () => t.emptyStatement(),

  verify: () =>
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier('t'), t.identifier('pass')),
        [],
      ),
    ),
});

export default processor;
