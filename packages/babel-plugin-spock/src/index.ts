import { PluginObj } from '@babel/core';
import { NodePath } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { extractConfigFromState } from '@spockjs/config';

import assertifyStatement, {
  labels as assertionBlockLabels,
} from '@spockjs/assertion-block';

const transformLabeledBlockOrSingle = (
  transform: (statementPath: NodePath<BabelTypes.Statement>) => void,
  path: NodePath<BabelTypes.LabeledStatement>,
): void => {
  const labeledBodyPath = path.get('body') as NodePath<BabelTypes.Statement>;

  switch (labeledBodyPath.type) {
    case 'BlockStatement':
      // power-assert may add statements in betweeen,
      // so never reuse body array
      const statementPaths = () =>
        (labeledBodyPath.get('body') as any) as NodePath<
          BabelTypes.Statement
        >[];

      statementPaths().forEach(transform);

      // remove label
      path.replaceWithMultiple(statementPaths().map(stmtPath => stmtPath.node));
      break;
    default:
      transform(labeledBodyPath);

      // remove label
      path.replaceWith(labeledBodyPath);
  }
};

export default (babel: { types: typeof BabelTypes }): PluginObj => ({
  visitor: {
    LabeledStatement(path, state) {
      const config = extractConfigFromState(state);
      const label = path.node.label.name;

      // assertion block
      if (assertionBlockLabels.includes(label)) {
        transformLabeledBlockOrSingle(
          assertifyStatement(babel, state, config),
          path,
        );
      }
    },
  },
});
