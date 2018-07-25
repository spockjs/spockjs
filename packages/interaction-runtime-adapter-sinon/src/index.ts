import {
  InteractionDeclarationRuntimeAdapter,
  InteractionVerificationRuntimeAdapter,
} from '@spockjs/config';

export const declare: InteractionDeclarationRuntimeAdapter = declaration => {
  let mock = declaration.mockObject;

  const { methodName } = declaration;
  if (methodName != null) {
    mock = mock.expects(methodName);
  }
  mock = mock.withArgs(...declaration.args);

  if (declaration.kind === 'mock' || declaration.kind === 'combined') {
    const { cardinality } = declaration;
    mock = mock.atLeast(cardinality).atMost(cardinality);
  }

  if (declaration.kind === 'stub' || declaration.kind === 'combined') {
    mock = mock.returns(declaration.returnValue);
  }
};
export const verify: InteractionVerificationRuntimeAdapter = mock => {
  mock.verify();
};
