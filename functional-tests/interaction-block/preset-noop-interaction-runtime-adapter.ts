import { InteractionVerificationPostProcessor } from '@spockjs/config';

export const assertionPostProcessors = [];

// mark implicit dependency for jest
() => require('./noop-interaction-runtime-adapter');
export const interactionRuntimeAdapter = require.resolve(
  './noop-interaction-runtime-adapter',
);
export const interactionVerificationPostProcessors: InteractionVerificationPostProcessor[] = [
  t => () => t.emptyStatement(),
];
