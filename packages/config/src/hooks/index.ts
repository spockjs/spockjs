import { AssertionPostProcessor } from './assertion';
import { InteractionVerificationPostProcessor } from './interaction';

export interface Hooks {
  readonly assertionPostProcessors: ReadonlyArray<AssertionPostProcessor>;

  readonly interactionRuntimeAdapter: string;
  readonly interactionVerificationPostProcessors: ReadonlyArray<
    InteractionVerificationPostProcessor
  >;
}

export * from './assertion';
export * from './interaction';
