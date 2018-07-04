import regularErrorsAssertionPostProcessor from '@spockjs/assertion-post-processor-regular-errors';

import { AssertionPostProcessor } from '@spockjs/config';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  regularErrorsAssertionPostProcessor,
];

export const interactionProcessors = [];
