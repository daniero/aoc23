export function stringify(...args: any[]): string {
  return JSON.stringify(args);
}

export function memo<F extends (...args: any[]) => any>(
  fn: F,
  argsHasher: (...args: Parameters<F>) => any = stringify
): F {
  const results = new Map<ReturnType<typeof argsHasher>, F>();

  return ((...args: Parameters<F>) => {
    const hash = argsHasher(...args);
    if (results.has(hash)) {
      return results.get(hash);
    }
    const result = fn(...args);
    results.set(hash, result);
    return result;
  }) as F;
}

// PIPE: https://www.nexxel.dev/blog/pipe

interface Pipe {
  <A>(value: A): A;
  <A, B>(value: A, fn1: (input: A) => B): B;
  <A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
  <A, B, C, D>(
    value: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D
  ): D;
  <A, B, C, D, E>(
    value: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D,
    fn4: (input: D) => E
  ): E;
  // ... and so on
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const pipe: Pipe = (value: any, ...fns: Function[]): unknown => {
  return fns.reduce((acc, fn) => fn(acc), value);
};
