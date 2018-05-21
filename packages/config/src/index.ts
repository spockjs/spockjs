import * as t from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

import { Hooks } from './hooks';

/**
 * Config as it can be provided by the user.
 * Comments indicate transformations made to conform to InternalConfig format.
 */
export const configType = t.exact(
  t.partial({
    powerAssert: t.boolean,
    autoImport: t.union([t.boolean, t.string]),
    staticTruthCheck: t.boolean,
    assertFunctionName: t.string,
    presets: t.array(t.string),
  }),
  'Config',
);
export type Config = t.TypeOf<typeof configType>;

/**
 * Config that disables all but the core set of features.
 */
export const minimalConfig: Config = {
  powerAssert: false,
  autoImport: false,
};

/**
 * Config containing the settings used if they are missing in the user-specified config.
 */
export const defaultConfig = {
  powerAssert: true,
  autoImport: true,
  staticTruthCheck: false,
  assertFunctionName: '',
  presets: [],
};

/**
 * Config after sanitizing in extractConfigFromState.
 */
export interface InternalConfig {
  readonly powerAssert: boolean;
  readonly autoImport: string; // empty => no auto import
  readonly staticTruthCheck: boolean;
  readonly assertFunctionName: string; // empty => no custom assert function name
  readonly hooks: Hooks;
}

export const extractConfigFromState = ({
  opts,
}: {
  opts: any;
}): InternalConfig => {
  const decoded = configType.decode(opts);

  let {
    powerAssert,
    autoImport,
    staticTruthCheck,
    assertFunctionName,
    presets,
  } = decoded.getOrElseL(errors => {
    throw new Error(
      ['Invalid plugin configuration:', ...failure(errors)].join('\n'),
    );
  });

  // powerAssert
  if (powerAssert === undefined) {
    ({ powerAssert } = defaultConfig);
  }

  // autoImport
  if (autoImport === undefined) {
    ({ autoImport } = defaultConfig);
  }
  if (autoImport === false) {
    autoImport = '';
  }
  if (autoImport === true) {
    autoImport = 'power-assert';
  }

  // staticTruthCheck
  if (staticTruthCheck === undefined) {
    ({ staticTruthCheck } = defaultConfig);
  }

  // assertFunctionName
  if (assertFunctionName === undefined) {
    ({ assertFunctionName } = defaultConfig);
  }

  // presets
  if (presets === undefined) {
    ({ presets } = defaultConfig);
  }
  const hooks = presets.map(preset => require(preset) as Hooks).reduce(
    (accHooks, moreHooks) => ({
      assertionPostProcessors: [
        ...accHooks.assertionPostProcessors,
        ...moreHooks.assertionPostProcessors,
      ],
    }),
    { assertionPostProcessors: [] },
  );

  return {
    powerAssert,
    autoImport,
    staticTruthCheck,
    assertFunctionName,
    hooks,
  };
};
