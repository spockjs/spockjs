import print from '@babel/generator';
import template from '@babel/template';
import { ExpressionStatement, Statement } from '@babel/types';

import { InteractionProcessor } from '@spockjs/config';

const symbol = 'Symbol.for("spockjsInteractionDeclarations")';
const deepStrictEqual = 'require("deep-strict-equal")';
const prettyFormat = 'require("pretty-format")';

const declareInteraction = template(`
  if(!jest.isMockFunction(MOCK)) {
    const __spockjs_mock = ${prettyFormat}(MOCK);
    throw new Error(\`Expected the callee in an interaction declaration to be a Jest mock function, but '\${MOCK_NAME}' is \${__spockjs_mock}\`);
  }
  MOCK[${symbol}] = [
    ...(MOCK[${symbol}] || []),
    {
      args: ARGS,
      cardinality: CARDINALITY,
      returnValue: RETURN_VALUE,
    }
  ];
`);
const initStub = template(`
  STUB.mockImplementation(
    (...actual) =>
      (
        STUB[${symbol}].find(({ args: expected }) =>
          ${deepStrictEqual}(actual, expected),
        ) || {}
      ).returnValue,
  );
`);
const verify = template(`
  if(!jest.isMockFunction(MOCK)) {
    const __spockjs_mock = ${prettyFormat}(MOCK);
    throw new Error(\`Expected the value in an interaction verification to be a Jest mock function, but '\${MOCK_NAME}' is \${__spockjs_mock}\`);
  }
  (MOCK[${symbol}] || [])
    .filter(({ cardinality }) => cardinality != null)
    .forEach(({ args: expected, cardinality: expectedTimes }) => {
      const __spockjs_actualTimes = MOCK.mock.calls.filter(actual =>
        ${deepStrictEqual}([...actual], [...expected]),
      ).length;
      if (__spockjs_actualTimes !== expectedTimes) {
        const __spockjs_args = ${prettyFormat}(expected);
        throw new Error(
          \`Expected \${expectedTimes} call(s) to mock '\${MOCK_NAME}' with arguments \${__spockjs_args}, but received \${__spockjs_actualTimes} such call(s).\`,
        );
      }
    });
`);

const processor: InteractionProcessor = (t, config) => ({
  primary: true,

  declare: interaction => {
    const undefinedIdentifier = t.identifier('undefined');

    const { mockObject, args } = interaction;
    const cardinality =
      interaction.kind === 'stub'
        ? undefinedIdentifier
        : interaction.cardinality;
    const returnValue =
      interaction.kind === 'mock'
        ? undefinedIdentifier
        : interaction.returnValue;

    return t.blockStatement([
      ...((declareInteraction({
        MOCK: mockObject,
        ARGS: t.arrayExpression(args),
        CARDINALITY: cardinality,
        RETURN_VALUE: returnValue,
        MOCK_NAME: t.stringLiteral(print(mockObject).code),
      }) as any) as Statement[]),
      initStub({ STUB: mockObject }) as ExpressionStatement,
    ]);
  },

  verify: mockObject => {
    return t.blockStatement((verify({
      MOCK: mockObject,
      MOCK_NAME: t.stringLiteral(print(mockObject).code),
    }) as any) as Statement[]);
  },
});

export default processor;
