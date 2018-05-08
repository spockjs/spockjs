import { Hooks } from './hooks';

/**
 * Config after sanitizing in extractConfigFromState.
 */
export interface InternalConfig {
  powerAssert: boolean;
  autoImport: string; // empty => no auto import
  staticTruthCheck: boolean;
  assertFunctionName: string; // empty => no custom assert function name
  hooks: Hooks;
}

/**
 * Config as it can be provided by the user.
 * Comments indicate transformations made to conform to InternalConfig format.
 */
export interface Config {
  powerAssert?: boolean;
  autoImport?: boolean | string; // false => '', true => 'power-assert'
  staticTruthCheck?: boolean;
  assertFunctionName?: string;
  presets?: string[]; // => hooks
}

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
 * Config that disables all but the core set of features.
 */
export const minimalConfig = {
  powerAssert: false,
  autoImport: false,
};

// tslint:disable no-parameter-reassignment
export const extractConfigFromState = ({
  opts: {
    powerAssert,
    autoImport,
    staticTruthCheck,
    assertFunctionName,
    presets,
  },
}: {
  opts: Config;
}): InternalConfig => {
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
