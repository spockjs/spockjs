import { Scope } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

import { InternalConfig } from './config';

const DEFAULT_ASSERTION_FUNCTION_NAME_HINT = 'assert';

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

const addImport = (
  scope: Scope,
  t: typeof BabelTypes,
  source: string,
  name: string,
) => {
  const program = scope.getProgramParent().path;

  // Generate default import from exact name or default name hint.
  // Using @babel/helper-module-imports would give us commonjs support
  // for free without requiring @babel/preset-env, however
  // 1. it does not support exact names, so we would still need to
  //    use our manual import generation if assertFunctionName is set and
  // 2. it might generate SequenceExpressions instead of Identifiers,
  //    which are annoying to deal with because of powerAssert patterns.
  const id = name
    ? t.identifier(name)
    : scope.generateUidIdentifier(DEFAULT_ASSERTION_FUNCTION_NAME_HINT);
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
  { autoImport: importSource, assertFunctionName }: InternalConfig,
) => (scope: Scope) => {
  if (importSource) {
    const name = findExistingImportFromSource(scope, t, importSource);
    if (name) {
      return t.identifier(name);
    }

    return addImport(scope, t, importSource, assertFunctionName);
  }

  return t.identifier(
    assertFunctionName || DEFAULT_ASSERTION_FUNCTION_NAME_HINT,
  );
};
