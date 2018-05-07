import { Scope } from '@babel/traverse';
import * as BabelTypes from '@babel/types';

export const findExistingImport = (
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

export const addImport = (
  scope: Scope,
  t: typeof BabelTypes,
  source: string,
  exactName: string,
  fallbackNameHint: string,
) => {
  if (exactName) {
    // clear possible binding conflicts
    scope.rename(exactName);
  }

  const program = scope.getProgramParent().path;

  // Generate default import from exact name or default name hint.
  // Using @babel/helper-module-imports would give us commonjs support
  // for free without requiring @babel/preset-env, however
  // 1. it does not support exact names, so we would still need to
  //    use our manual import generation if assertFunctionName is set and
  // 2. it might generate SequenceExpressions instead of Identifiers,
  //    which are annoying to deal with because of powerAssert patterns.
  const id = exactName
    ? t.identifier(exactName)
    : scope.generateUidIdentifier(fallbackNameHint);
  (program as any).unshiftContainer(
    'body',
    t.importDeclaration(
      [t.importDefaultSpecifier(id)],
      t.stringLiteral(source),
    ),
  );

  return id.name;
};
