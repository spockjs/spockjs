import * as BabelTypes from '@babel/types';

import { InternalConfig } from '../..';

export interface CompileTimeBaseInteractionDeclaration {
  mockObject: BabelTypes.Expression;
  args: (BabelTypes.Expression | BabelTypes.SpreadElement)[];
}
export interface CompileTimeMockInteractionDeclaration
  extends CompileTimeBaseInteractionDeclaration {
  kind: 'mock';
  cardinality: BabelTypes.Expression;
}
export interface CompileTimeStubInteractionDeclaration
  extends CompileTimeBaseInteractionDeclaration {
  kind: 'stub';
  returnValue: BabelTypes.Expression;
}
export interface CompileTimeCombinedInteractionDeclaration
  extends CompileTimeBaseInteractionDeclaration {
  kind: 'combined';
  cardinality: BabelTypes.Expression;
  returnValue: BabelTypes.Expression;
}
export type CompileTimeInteractionDeclaration =
  | CompileTimeMockInteractionDeclaration
  | CompileTimeStubInteractionDeclaration
  | CompileTimeCombinedInteractionDeclaration;

export type InteractionVerificationPostProcessor = (
  t: typeof BabelTypes,
  config: InternalConfig,
) => (mockObject: BabelTypes.Expression) => BabelTypes.Statement;
