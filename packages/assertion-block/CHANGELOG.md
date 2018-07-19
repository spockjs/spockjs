# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/spockjs/spockjs/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-07-19)


### Features

* **assertion-block:** supply assertion error message ([3650fad](https://github.com/spockjs/spockjs/commit/3650fad))
* **config:** export and document hooks for usage by external presets ([79c0706](https://github.com/spockjs/spockjs/commit/79c0706))


### BREAKING CHANGES

* **assertion-block:** Generated assertions may now contain a message
as a second parameter to the assert function.
AssertionPostProcessors will need to take this into account
both for returning a power-assert pattern
and for their own AST transformations.
