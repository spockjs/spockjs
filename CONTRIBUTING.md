# Contributing

We use [yarn](https://yarnpkg.org) as our package manager. Run `yarn` to install
the dependencies.

## Note: Current babel version situation

At the moment, we need both babel 6 (peer/dev) and babel 7 beta (dev) installed
in the project directory.

Babel 6 is used by production code and tests, while babel 7 is used to compile
the production code and tests. The former cannot be upgraded because
`babel-plugin-espower` does not yet support babel 7, the latter cannot be
downgraded because we need `@babel/preset-typescript`, which is 7+ only.

Due to babel's change from regular to scoped packages, this is generally not a
problem, because the production code and tests can just import the regular
packages with version 6, while our `.babelrc` uses the scoped packages with
version 7.

However, `babel-jest` currently requires `babel-core@7.0.0-bridge.0` to be
installed in order to work with babel 7, so for `babel-core` we use yarn's alias
feature to install `babel-core@^6.0.0` as `babel-core-old` and use that module
name for imports in our production code and tests, while the bridge package for
Jest is installed under its regular name.

This workaround also makes yarn absolutely mandatory for hacking on this package
at the moment.

## Scripts

* `yarn all` - run all checks and build
  * `yarn lint` - lint the code using
    [tslint](https://palantir.github.io/tslint/)
  * `yarn typecheck` - typecheck the code using the
    [TypeScript](https://www.typescriptlang.org/) compiler
  * `yarn test-once` - perform a single [Jest](https://facebook.github.io/jest/)
    test run
  * `yarn build` - assemble the build output in the dist folder
* `yarn test` - run the tests in watch mode and show the coverage stats in the
  browser
* `yarn fix` - fix all auto-fixable issues and format the code
* `yarn clean` - removes generated distribution files and coverage stats

## Commits

We follow the
[Angular commit message conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md).
This is also important for automatic generation of changelogs.

## Releasing

1. Check that CI ran successfully
2. Update the `CHANGELOG.md` using
   [standard-version](https://github.com/conventional-changelog/standard-version)
3. `yarn clean && yarn all`
4. `cd dist`
5. Remove the `private: true` property from the `package.json` file
6. `npm publish`
7. `git push --follow-tags`
