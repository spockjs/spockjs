import { InteractionProcessor } from '@spockjs/config';

import interactionProcessor from '@spockjs/interaction-processor-sinon-mocks';

export const assertionPostProcessors = [];

export const interactionProcessors: InteractionProcessor[] = [
  interactionProcessor,
];
