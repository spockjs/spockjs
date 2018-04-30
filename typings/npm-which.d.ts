declare module 'npm-which' {
  export default function(
    dirname: string,
  ): {
    sync: (program: string) => string;
  };
}
