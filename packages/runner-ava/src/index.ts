import avaAssertAssertionPostProcessor from '@spockjs/assertion-post-processor-ava-assert';

import { AssertionPostProcessor } from '@spockjs/config/src/hooks';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  avaAssertAssertionPostProcessor,
];
