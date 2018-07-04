export interface RuntimeBaseInteractionDeclaration {
  mockObject: any;
  /**
   * For a call like `mock.method()`,
   * mockObject will be just `mock`,
   * and methodName will be `'method'`.
   */
  methodName?: string;
  args: any[];
}
export interface RuntimeMockInteractionDeclaration
  extends RuntimeBaseInteractionDeclaration {
  kind: 'mock';
  cardinality: number;
}
export interface RuntimeStubInteractionDeclaration
  extends RuntimeBaseInteractionDeclaration {
  kind: 'stub';
  returnValue: any;
}
export interface RuntimeCombinedInteractionDeclaration
  extends RuntimeBaseInteractionDeclaration {
  kind: 'combined';
  cardinality: number;
  returnValue: any;
}
export type RuntimeInteractionDeclaration =
  | RuntimeMockInteractionDeclaration
  | RuntimeStubInteractionDeclaration
  | RuntimeCombinedInteractionDeclaration;

export type InteractionDeclarationRuntimeAdapter = (
  declaration: RuntimeInteractionDeclaration,
) => void;
export type InteractionVerificationRuntimeAdapter = (mockObject: any) => void;
