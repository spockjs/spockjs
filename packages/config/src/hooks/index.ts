import { AssertionPostProcessor } from './assertion';
import { InteractionProcessor } from './interaction';

export interface Hooks {
  readonly assertionPostProcessors: ReadonlyArray<AssertionPostProcessor>;
  readonly interactionProcessors: ReadonlyArray<InteractionProcessor>;
}

export * from './assertion';
export * from './interaction';
