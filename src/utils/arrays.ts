export function fill<T>(size: number, fn: (i: number) => T): T[] {
  return new Array(size).fill(false).map((_, i) => fn(i));
}
