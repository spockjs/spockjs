import { InteractionProcessor } from '@spockjs/config';

import interactionProcessor from '@spockjs/interaction-processor-jest-mocks';

export const assertionPostProcessors = [];

export const interactionProcessors: InteractionProcessor[] = [
  interactionProcessor,
];
