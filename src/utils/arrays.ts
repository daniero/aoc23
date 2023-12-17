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

export function pairs<T>(elements: T[]): Array<[T, T]> {
  const pairs = [];

  for (let i = 0; i < elements.length - 1; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      pairs.push([elements[i], elements[j]] as [T, T]);
    }
  }

  return pairs;
}

export function by<T>(
  ...fns: [(x: T) => number | string, ...Array<(x: T) => number | string>]
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    for (const fn of fns) {
      const vb = fn(b);
      const va = fn(a);

      let result;
      if (typeof vb === 'string' || typeof va === 'string') {
        result = va.toString().localeCompare(vb.toString());
      } else {
        result = va - vb;
      }

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}
