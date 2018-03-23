import * as path from 'path';

// paths
export const resolvePath = path.resolve.bind(path, __dirname);

const rootPath = resolvePath('..', '..');
export const tsconfigPath = resolvePath(rootPath, 'tsconfig.json');

export const nodeModulesPath = resolvePath(rootPath, 'node_modules');
export const tsNodePath = resolvePath(nodeModulesPath, '.bin', 'ts-node');
