# Contributing

We use [yarn](https://yarnpkg.org) as our package manager. Run `yarn` to install
the dependencies.

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
