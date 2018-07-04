import * as BabelTypes from '@babel/types';

import { InternalConfig } from '..';

export interface BaseInteractionDeclaration {
  mockObject: BabelTypes.Expression;
  args: (BabelTypes.Expression | BabelTypes.SpreadElement)[];
}
export interface MockInteractionDeclaration extends BaseInteractionDeclaration {
  kind: 'mock';
  cardinality: BabelTypes.Expression;
}
export interface StubInteractionDeclaration extends BaseInteractionDeclaration {
  kind: 'stub';
  returnValue: BabelTypes.Expression;
}
export interface CombinedInteractionDeclaration
  extends BaseInteractionDeclaration {
  kind: 'combined';
  cardinality: BabelTypes.Expression;
  returnValue: BabelTypes.Expression;
}
export type InteractionDeclaration =
  | MockInteractionDeclaration
  | StubInteractionDeclaration
  | CombinedInteractionDeclaration;

export type InteractionProcessor = (
  t: typeof BabelTypes,
  config: InternalConfig,
) => {
  /**
   * Whether the processor is meant for standalone use (`true`),
   * as is the case for those implementing mocking library bindings,
   * or it is an auxiliary processor (`false`),
   * such as one that provides better integration with a test runner.
   * Users will see an error when attempting to use interaction blocks
   * without a primary interaction processor.
   */
  primary: boolean;
  declare(interaction: InteractionDeclaration): BabelTypes.Statement;
  verify(mockObject: BabelTypes.Expression): BabelTypes.Statement;
};
