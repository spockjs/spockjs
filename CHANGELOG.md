# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0-beta.1"></a>
# [1.0.0-beta.1](http://spockjs/spockjs/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2018-07-19)


### Code Refactoring

* rename runner-{ava,jest} to preset-runner-{ava,jest} ([8fab76d](http://spockjs/spockjs/commits/8fab76d))


### Features

* **assertion-block:** supply assertion error message ([3650fad](http://spockjs/spockjs/commits/3650fad))
* **config:** export and document hooks for usage by external presets ([79c0706](http://spockjs/spockjs/commits/79c0706))


### BREAKING CHANGES

* **assertion-block:** Generated assertions may now contain a message
as a second parameter to the assert function.
AssertionPostProcessors will need to take this into account
both for returning a power-assert pattern
and for their own AST transformations.
* `@spockjs/runner-{ava,jest}` are now `@spockjs/preset-runner-{ava,jest}`





<a name="1.0.0-beta.0"></a>
# [1.0.0-beta.0](http://spockjs/spockjs/compare/v0.6.0...v1.0.0-beta.0) (2018-06-07)


### Features

* cleaner output with presets [@spockjs](http://spockjs/spockjs)/runner-{jest,ava} ([586114c](http://spockjs/spockjs/commits/586114c))
* native AVA assertions ([6ecbe7a](http://spockjs/spockjs/commits/6ecbe7a)), closes [#70](http://spockjs/spockjs/issues/70)
* remove `expect`/`then` labels ([07e5010](http://spockjs/spockjs/commits/07e5010))
* unwrap assertion blocks ([71be3c6](http://spockjs/spockjs/commits/71be3c6))
* validate babel-plugin-spock config ([fb9006e](http://spockjs/spockjs/commits/fb9006e))


### BREAKING CHANGES

* If you previously passed an invalid configuration object to the plugin,
but it still worked correctly, you will now get an error.





<a name="0.6.0"></a>
# [0.6.0](http://spockjs/spockjs/compare/v0.5.0...v0.6.0) (2018-04-30)


### build

* convert to lerna monorepo ([788546c](http://spockjs/spockjs/commits/788546c))


### BREAKING CHANGES

* rename package from babel-plugin-spock to
@spockjs/babel-plugin-spock





<a name="0.5.0"></a>

# [0.5.0](https://github.com/spockjs/spockjs/compare/v0.4.0...v0.5.0) (2018-04-27)

### Features

* add assertFunctionName option ([448b277](https://github.com/spockjs/spockjs/commit/448b277))
* **assert-function-name/auto-import:** gracefully handle conflicts by renaming existing bindings ([4bea5c8](https://github.com/spockjs/spockjs/commit/4bea5c8))

<a name="0.4.0"></a>

# [0.4.0](https://github.com/spockjs/spockjs/compare/v0.3.1...v0.4.0) (2018-03-30)

### Bug Fixes

* **auto-import:** avoid unnecessary duplicate imports ([308ffcb](https://github.com/spockjs/spockjs/commit/308ffcb))
* **package:** update babel core dependency name ([8339638](https://github.com/spockjs/spockjs/commit/8339638))

### Features

* staticTruthCheck option ([5a2da53](https://github.com/spockjs/spockjs/commit/5a2da53))

<a name="0.3.1"></a>

## [0.3.1](https://github.com/spockjs/spockjs/compare/v0.3.0...v0.3.1) (2018-03-18)

### Bug Fixes

* **power-assert:** make power assertions work when using autoImport ([f2fbf43](https://github.com/spockjs/spockjs/commit/f2fbf43))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/spockjs/spockjs/compare/v0.2.0...v0.3.0) (2018-03-18)

### Features

* auto-import assert function ([8bae640](https://github.com/spockjs/spockjs/commit/8bae640))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/spockjs/spockjs/compare/v0.1.0...v0.2.0) (2018-01-27)

### Bug Fixes

* **assertions:** support non-standard JSX syntax ([81fa923](https://github.com/spockjs/spockjs/commit/81fa923))

### Features

* babel 7 support ([830465b](https://github.com/spockjs/spockjs/commit/830465b))

<a name="0.1.0"></a>

# 0.1.0 (2017-11-29)

### Features

* (power) assertion blocks ([457f516](https://github.com/spockjs/spockjs/commit/457f516))
