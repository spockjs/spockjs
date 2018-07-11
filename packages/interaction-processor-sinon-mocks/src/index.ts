import template from '@babel/template';
import { ExpressionStatement, Identifier } from '@babel/types';

import { InteractionProcessor } from '@spockjs/config';

// Sinon stubs do not implement `withExactArgs`,
// so we do not use it on mocks either for consistency reasons
// and just have to accept that excess arguments will go unnoticed
const declareStubInteraction = template(`
  STUB
    .withArgs(ARGS)
    .returns(RETURN_VALUE);
`);
const declareMockInteraction = template(`
  MOCK
    .expects(METHOD_NAME)
    .withArgs(ARGS)
    .atLeast(CARDINALITY)
    .atMost(CARDINALITY);
`);
const declareMockFunctionInteraction = template(`
  MOCK
    .withArgs(ARGS)
    .atLeast(CARDINALITY)
    .atMost(CARDINALITY);
`);
const declareMockAndStubInteraction = template(`
  MOCK
    .expects(METHOD_NAME)
    .withArgs(ARGS)
    .atLeast(CARDINALITY)
    .atMost(CARDINALITY)
    .returns(RETURN_VALUE);
`);
const declareMockAndStubFunctionInteraction = template(`
  MOCK
    .withArgs(ARGS)
    .atLeast(CARDINALITY)
    .atMost(CARDINALITY)
    .returns(RETURN_VALUE);
`);

const verify = template(`
  MOCK.verify();
`);

const processor: InteractionProcessor = (t, config) => ({
  primary: true,

  declare: interaction => {
    const { mockObject, args } = interaction;

    if (interaction.kind === 'mock' || interaction.kind === 'combined') {
      const { cardinality } = interaction;

      if (t.isMemberExpression(mockObject)) {
        const { object: mock, property: method, computed } = mockObject;
        const methodName = computed
          ? t.callExpression(t.identifier('String'), [method])
          : t.stringLiteral((method as Identifier).name);

        if (interaction.kind === 'combined') {
          // combined mocking and stubbing
          const { returnValue } = interaction;
          return declareMockAndStubInteraction({
            MOCK: mock,
            METHOD_NAME: methodName,
            ARGS: args as any,
            CARDINALITY: cardinality,
            RETURN_VALUE: returnValue,
          }) as ExpressionStatement;
        }

        // mocking
        return declareMockInteraction({
          MOCK: mock,
          METHOD_NAME: methodName,
          ARGS: args as any,
          CARDINALITY: cardinality,
        }) as ExpressionStatement;
      }

      if (interaction.kind === 'combined') {
        // combined mocking and stubbing with a plain function
        const { returnValue } = interaction;
        return declareMockAndStubFunctionInteraction({
          MOCK: mockObject,
          ARGS: args as any,
          CARDINALITY: cardinality,
          RETURN_VALUE: returnValue,
        }) as ExpressionStatement;
      }

      // mocking with a plain function
      return declareMockFunctionInteraction({
        MOCK: mockObject,
        ARGS: args as any,
        CARDINALITY: cardinality,
      }) as ExpressionStatement;
    }

    // stubbing
    const { returnValue } = interaction;
    return declareStubInteraction({
      STUB: mockObject,
      ARGS: args as any,
      RETURN_VALUE: returnValue,
    }) as ExpressionStatement;
  },

  verify: mockObject => {
    return verify({
      MOCK: mockObject,
    }) as ExpressionStatement;
  },
});

export default processor;
