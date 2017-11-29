export interface Config {
  powerAssert: boolean;
}

export const defaultConfig: Config = {
  powerAssert: true,
};

export const extractConfigFromState = (state: any): Config => ({
  ...defaultConfig,
  ...state.opts,
});
