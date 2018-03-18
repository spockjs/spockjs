import { PluginObj } from '@babel/core';
import * as BabelTypes from '@babel/types';
import { NodePath } from 'babel-traverse';

import assertifyStatement from './assertify-statement';
import { extractConfigFromState } from './config';

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
              const statementPaths = (bodyPath.get('body') as any) as NodePath<
                BabelTypes.Statement
              >[];
              statementPaths.forEach(assertify);
              break;
            default:
              assertify(bodyPath);
          }
        }
      },
    },
  };
};

export default plugin;
