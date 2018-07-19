declare module '@babel/core' {
  export * from 'babel-core';
}

declare module '@babel/types' {
  export * from 'babel-types';
}

declare module '@babel/traverse' {
  export * from 'babel-traverse';
}

declare module '@babel/template' {
  export * from 'babel-template';

  import * as template from 'babel-template';
  export default template;
}

declare module '@babel/generator' {
  export * from 'babel-generator';

  import generator from 'babel-generator';
  export default generator;
}

declare module '@babel/helper-module-imports' {
  import { NodePath } from '@babel/traverse';
  import { Node } from '@babel/types';

  export const addNamed: (
    path: NodePath,
    imported: string,
    source: string,
    opts?: { nameHint: string },
  ) => Node;
}
