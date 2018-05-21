# Contributing

We use [yarn](https://yarnpkg.org) as our package manager. Run `yarn` to install
the dependencies.

**Note:** The tests currently do not pass on node 10 due to a bug in node. Please use node 9 instead.

## Scripts

* `yarn all` - run all checks and build
  * `yarn lint` - lint the code using
    [tslint](https://palantir.github.io/tslint/)
  * `yarn typecheck` - typecheck the code using the
    [TypeScript](https://www.typescriptlang.org/) compiler
  * `yarn test-once` - perform a single [Jest](https://facebook.github.io/jest/)
    test run
  * `yarn build` - assemble the build output in the dist folder of each package
* `yarn test` - run the tests in watch mode
* `yarn fix` - fix all auto-fixable issues and format the code
* `yarn clean` - remove generated distribution files and coverage stats

## Commits

We follow the
[Angular commit message conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md).
This is also important for automatic generation of changelogs.

## Releasing

1.  Check that CI ran successfully
2.  `npm login --scope=@spockjs`
3.  `yarn clean && yarn all && scripts/publish.sh`
