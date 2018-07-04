import avaAssertAssertionPostProcessor from '@spockjs/assertion-post-processor-ava-assert';
import avaPassAfterVerifyInteractionVerificationPostProcessor from '@spockjs/interaction-processor-ava-pass-after-verify';

import {
  AssertionPostProcessor,
  InteractionVerificationPostProcessor,
} from '@spockjs/config';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  avaAssertAssertionPostProcessor,
];

export const interactionRuntimeAdapter = '';
export const interactionVerificationPostProcessors: InteractionVerificationPostProcessor[] = [
  avaPassAfterVerifyInteractionVerificationPostProcessor,
];
