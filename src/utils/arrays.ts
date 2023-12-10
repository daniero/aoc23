export function replace<T>(
  arr: T[],
  index: number,
  replaceFn: (t: T) => T
): T[] {
  const newT = arr.at(index) as T; // ignore undefined
  return arr.with(index, replaceFn(newT));
}

export function range(start: number, stop: number): number[] {
  const size = stop - start;
  return new Array(size).fill(false).map((_, i) => i + start);
}

export function loop(length: number, start: number = 0): number[] {
  return new Array(length).fill(false).map((_, i) => i + start);
}

export function fill<T>(size: number, fn: (i: number) => T): T[] {
  return new Array(size).fill(false).map((_, i) => fn(i));
}
