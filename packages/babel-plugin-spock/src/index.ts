import { PluginObj } from '@babel/core';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { extractConfigFromState } from '@spockjs/config';

import assertifyStatement from './assertify-statement';

const assertionBlockLabels = ['expect', 'then'];

const plugin = (babel: { types: typeof BabelTypes }): PluginObj => {
  return {
    visitor: {
      LabeledStatement(path, state) {
        const config = extractConfigFromState(state);
        const assertify = assertifyStatement(babel, state, config);

        if (assertionBlockLabels.includes(path.node.label.name)) {
          const bodyPath = path.get('body') as NodePath<BabelTypes.Statement>;
          switch (bodyPath.type) {
            case 'BlockStatement':
              // power-assert may add statements in betweeen,
              // so never reuse body array
              const statementPaths = () =>
                (bodyPath.get('body') as any) as NodePath<
                  BabelTypes.Statement
                >[];

              statementPaths().forEach(assertify);
              path.replaceWithMultiple(
                statementPaths().map(stmtPath => stmtPath.node),
              );
              break;
            default:
              assertify(bodyPath);
              path.replaceWith(bodyPath);
          }
        }
      },
    },
  };
};

export default plugin;
