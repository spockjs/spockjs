# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](https://github.com/spockjs/spockjs/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-07-19)


### Code Refactoring

* rename runner-{ava,jest} to preset-runner-{ava,jest} ([8fab76d](https://github.com/spockjs/spockjs/commit/8fab76d))


### Features

* **assertion-block:** supply assertion error message ([3650fad](https://github.com/spockjs/spockjs/commit/3650fad))


### BREAKING CHANGES

* **assertion-block:** Generated assertions may now contain a message
as a second parameter to the assert function.
AssertionPostProcessors will need to take this into account
both for returning a power-assert pattern
and for their own AST transformations.
* `@spockjs/runner-{ava,jest}` are now `@spockjs/preset-runner-{ava,jest}`





<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](https://github.com/spockjs/spockjs/compare/v0.6.0...v1.0.0-beta.0) (2018-06-07)


### Features

* native AVA assertions ([6ecbe7a](https://github.com/spockjs/spockjs/commit/6ecbe7a)), closes [#70](https://github.com/spockjs/spockjs/issues/70)
* validate babel-plugin-spock config ([fb9006e](https://github.com/spockjs/spockjs/commit/fb9006e))


### BREAKING CHANGES

* If you previously passed an invalid configuration object to the plugin,
but it still worked correctly, you will now get an error.
