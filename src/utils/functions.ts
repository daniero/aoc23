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
