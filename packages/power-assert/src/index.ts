import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import createEspowerVisitor from 'babel-plugin-espower/create';

export default (
  babel: { types: typeof BabelTypes },
  state: any,
  assertFunctionName: string,
  statementPath: NodePath<BabelTypes.Statement>,
) => {
  // Technically an invalid visitor call,
  // pretending statementPath is a NodePath<BabelTypes.Program>.
  // Definitely keep babel-plugin-espower dependency version-locked!
  createEspowerVisitor(babel, {
    embedAst: true,
    patterns: [`${assertFunctionName}(value)`],
  }).visitor.Program(statementPath, state);
};
