import regularErrorsAssertionPostProcessor from '@spockjs/assertion-post-processor-regular-errors';

import { AssertionPostProcessor } from '@spockjs/config/src/hooks';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  regularErrorsAssertionPostProcessor,
];
