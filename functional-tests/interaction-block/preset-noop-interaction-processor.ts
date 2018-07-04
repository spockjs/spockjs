import { InteractionProcessor } from '@spockjs/config';

export const assertionPostProcessors = [];

export const interactionProcessors: InteractionProcessor[] = [
  t => ({
    primary: true,
    declare: () => t.emptyStatement(),
    verify: () => t.emptyStatement(),
  }),
];
