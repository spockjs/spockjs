import * as path from 'path';

/*
  Integration tests execute the test runners with ts-node
  so that we can use the plugin's index.ts directly for
  the babel transformation performed by the test runners.
  This disposes the need to build the plugin separately
  before running the integration tests.
*/
export const resolvePath = path.resolve.bind(path, __dirname);

const rootPath = resolvePath('..', '..');
export const tsconfigPath = resolvePath(rootPath, 'tsconfig.json');

export const nodeModulesPath = resolvePath(rootPath, 'node_modules');
export const tsNodePath = resolvePath(nodeModulesPath, '.bin', 'ts-node');
