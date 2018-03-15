import { PluginObj } from '@babel/core';
import * as BabelTypes from '@babel/types';
import createEspowerVisitor from 'babel-plugin-espower/create';
import { NodePath } from 'babel-traverse';

import assertifyStatement from './assertify-statement';
import { extractConfigFromState } from './config';

const assertionBlockLabels = ['expect', 'then'];

const plugin = (babel: { types: typeof BabelTypes }): PluginObj => {
  const espowerVisitor = createEspowerVisitor(babel, {
    embedAst: true,
    patterns: ['assert(value)'],
  });

  return {
    visitor: {
      LabeledStatement(path, state) {
        const config = extractConfigFromState(state);
        const assertify = assertifyStatement(babel.types, config);

        if (assertionBlockLabels.includes(path.node.label.name)) {
          const bodyPath = path.get('body') as NodePath<BabelTypes.Statement>;
          switch (bodyPath.type) {
            case 'BlockStatement':
              const statementPaths = (bodyPath.get('body') as any) as NodePath<
                BabelTypes.Statement
              >[];
              statementPaths.forEach(assertify);
              break;
            default:
              assertify(bodyPath);
          }

          if (config.powerAssert) {
            // Now let espower generate nice power assertions for this labeled statement
            espowerVisitor.visitor.Program(path, state);
          }
        }
      },
    },
  };
};

export default plugin;
