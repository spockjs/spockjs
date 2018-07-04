import avaAssertAssertionPostProcessor from '@spockjs/assertion-post-processor-ava-assert';
import avaPassAfterVerifyInteractionProcessor from '@spockjs/interaction-processor-ava-pass-after-verify';

import { AssertionPostProcessor, InteractionProcessor } from '@spockjs/config';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  avaAssertAssertionPostProcessor,
];

export const interactionProcessors: InteractionProcessor[] = [
  avaPassAfterVerifyInteractionProcessor,
];
