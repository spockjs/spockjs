import { SpawnSyncOptions } from 'child_process';
import { sync as run } from 'cross-spawn';
import { getInstalledPathSync } from 'get-installed-path';
import which from 'npm-which';
import * as path from 'path';

/*
  Integration tests execute the test runners with ts-node
  so that we can use the plugin's index.ts directly for
  the babel transformation performed by the test runners.
  This disposes the need to build the plugin separately
  before running the integration tests.

  The main Jest process run by `yarn test` does the same
  thing, it runs in ts-node as well.

  Either way, runners needs to be started with cache disabled,
  because the transform cache is only invalidated when the
  test files that use assertion blocks etc. change,
  but not when the babel plugin that transforms them changes.
*/

// paths

export const resolvePath: (...segments: string[]) => string = path.resolve.bind(
  path,
  __dirname,
);
export const modulePath = (packageName: string) =>
  getInstalledPathSync(packageName, { local: true });

const tsconfigPath = resolvePath('..', 'tsconfig.json');

const tsNodePath = which(__dirname).sync('ts-node');

// babel / typescript helpers

/**
 * Preferred way to use JIT TypeScript compilation,
 * available when @babel/register is not required.
 * No further arguments or environment overrides required.
 * If JIT Babel compilation is also required,
 * fall back to the JitArgs/JitEnv this file exports as well.
 */
export const runWithTypescriptJit = (
  args: string[],
  options?: SpawnSyncOptions,
) => run(tsNodePath, ['--project', tsconfigPath, ...args], options);

export const requireBabelJitArgs = ['--require', '@babel/register'];
export const requireTypescriptJitArgs = ['--require', 'ts-node/register'];

export const babelJitEnv = { BABEL_DISABLE_CACHE: '1' };
export const typescriptJitEnv = { TS_NODE_PROJECT: tsconfigPath };
