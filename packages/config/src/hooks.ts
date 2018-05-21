import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from '.';

export type AssertionPostProcessor = (
  t: typeof BabelTypes,
  config: InternalConfig,
  path: NodePath<BabelTypes.ExpressionStatement>,
) => NodePath<BabelTypes.ExpressionStatement>;

export interface Hooks {
  readonly assertionPostProcessors: ReadonlyArray<AssertionPostProcessor>;
}
