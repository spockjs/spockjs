import avaAssertAssertionPostProcessor from '@spockjs/assertion-post-processor-ava-assert';

import { AssertionPostProcessor } from '@spockjs/config';

export const assertionPostProcessors: AssertionPostProcessor[] = [
  avaAssertAssertionPostProcessor,
];
