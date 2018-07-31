import {
  InteractionDeclarationRuntimeAdapter,
  InteractionVerificationRuntimeAdapter,
} from '@spockjs/config';
import deepStrictEqual from 'deep-strict-equal';
import prettyFormat from 'pretty-format';

const interactionsSymbol = Symbol();
interface Interaction {
  args: any[];
  cardinality?: number;
  returnValue?: any;
}
interface InteractionsStore {
  [interactionsSymbol]?: Interaction[];
}

export const declare: InteractionDeclarationRuntimeAdapter = declaration => {
  const { args, methodName } = declaration;
  let { mockObject } = declaration;

  if (methodName != null) {
    mockObject = mockObject[methodName];
  }

  if (jest.isMockFunction(mockObject)) {
    const interactionsStore = mockObject as InteractionsStore;

    const interactions: Interaction[] = (interactionsStore[
      interactionsSymbol
    ] = [
      ...(interactionsStore[interactionsSymbol] || []),
      {
        args,
        ...(declaration.kind === 'mock' || declaration.kind === 'combined'
          ? { cardinality: declaration.cardinality }
          : {}),
        ...(declaration.kind === 'stub' || declaration.kind === 'combined'
          ? { returnValue: declaration.returnValue }
          : {}),
      },
    ]);

    mockObject.mockImplementation(
      (...actual) =>
        (
          interactions.find(({ args: expected }) =>
            deepStrictEqual(actual, expected),
          ) || { returnValue: undefined }
        ).returnValue,
    );
  } else {
    throw new Error(
      `Expected the callee in an interaction declaration to be a Jest mock function, but received ${prettyFormat(
        mockObject,
      )}.`,
    );
  }
};
export const verify: InteractionVerificationRuntimeAdapter = mockObject => {
  if (jest.isMockFunction(mockObject)) {
    const interactionsStore = mockObject as InteractionsStore;

    (interactionsStore[interactionsSymbol] || [])
      .filter(({ cardinality }) => cardinality !== null)
      .forEach(({ args: expected, cardinality: expectedTimes }) => {
        const actualTimes = mockObject.mock.calls.filter(actual =>
          deepStrictEqual([...actual], [...expected]),
        ).length;
        if (actualTimes !== expectedTimes) {
          throw new Error(
            `Expected ${expectedTimes} call(s) to mock ${mockObject.getMockName()} with arguments ${prettyFormat(
              expected,
            )}, but received ${actualTimes} such call(s).`,
          );
        }
      });
  } else {
    throw new Error(
      `Expected the value in an interaction verification to be a Jest mock function, but received ${prettyFormat(
        mockObject,
      )}.`,
    );
  }
};
