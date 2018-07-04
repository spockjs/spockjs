import { InteractionProcessor } from '@spockjs/config';

export const assertionPostProcessors = [];

export const interactionProcessors: InteractionProcessor[] = [
  t => ({
    primary: false,
    declare: () => t.emptyStatement(),
    verify: () => t.emptyStatement(),
  }),
];
