declare module 'tap-parser' {
  declare const Parser: {
    new (resultsCallback: (results: any) => void): NodeJS.WritableStream;
  };
  export = Parser;
}
