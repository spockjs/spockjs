declare module 'get-installed-path' {
  export const getInstalledPathSync: (
    packageName: string,
    opts?: { local: boolean },
  ) => string;
}
