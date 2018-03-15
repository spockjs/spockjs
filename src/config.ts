/**
 * Config after sanitizing in extractConfigFromState.
 */
export interface InternalConfig {
  powerAssert: boolean;
  autoImport: string; // empty => no auto import
}

/**
 * Config as it can be provided by the user.
 * Comments indicate transformations made to conform to InternalConfig format.
 */
export interface Config {
  powerAssert?: boolean;
  autoImport?: boolean | string; // false => '', true => 'power-assert'
}

export const defaultConfig = {
  powerAssert: true,
  autoImport: true,
};

// tslint:disable no-parameter-reassignment
export const extractConfigFromState = ({
  opts: { powerAssert, autoImport },
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

  return {
    powerAssert,
    autoImport,
  };
};
