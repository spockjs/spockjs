import { Scope } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from './config';

const ASSERT_IDENTIFIER_NAME = 'assert';

const findExistingImportFromSource = (
  scope: Scope,
  t: typeof BabelTypes,
  source: string,
) => {
  const program = scope.getProgramParent().path.node as BabelTypes.Program;

  // try to find existing default import from source
  for (const stmt of program.body) {
    if (t.isImportDeclaration(stmt) && stmt.source.value === source) {
      const defaultSpecifier = stmt.specifiers.find(specifier =>
        t.isImportDefaultSpecifier(specifier),
      ) as BabelTypes.ImportDefaultSpecifier | undefined;
      if (defaultSpecifier) {
        const { local } = defaultSpecifier;
        const { name } = local;
        // make sure the import is not shadowed in the scope
        if (scope.bindingIdentifierEquals(name, local)) {
          return name;
        }
      }
    }
  }
  return;
};

const addImport = (scope: Scope, t: typeof BabelTypes, source: string) => {
  const program = scope.getProgramParent().path;

  // generate default import from source
  const id = scope.generateUidIdentifier(ASSERT_IDENTIFIER_NAME);
  (program as any).unshiftContainer(
    'body',
    t.importDeclaration(
      [t.importDefaultSpecifier(id)],
      t.stringLiteral(source),
    ),
  );

  return id;
};

export default (
  t: typeof BabelTypes,
  { autoImport: importSource }: InternalConfig,
) => (scope: Scope) => {
  if (importSource) {
    const name = findExistingImportFromSource(scope, t, importSource);
    if (name) {
      return t.identifier(name);
    }

    return addImport(scope, t, importSource);
  }

  return t.identifier(ASSERT_IDENTIFIER_NAME);
};
