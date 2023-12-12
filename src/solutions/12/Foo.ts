import { match } from '../../utils/regex.ts';

type Foo = ReturnType<typeof parseInput>;

export function parseInput(input: string): Array<[string, number[]]> {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [springs, ns] = line.split(' ');

      const numbers = match(ns, /\d+/g).map(([n]) => parseInt(n));

      return [springs, numbers];
    });
}

export function solvePart1(lines: Foo): any {
  return lines
    .map(([spring, numbers]) => {
      return brute(spring, numbers);
    })
    .reduce((a, b) => a + b);
}

function brute(spring: string, numbers: number[]): number {
  const wilds = match(spring, /\?/g).length;
  const combinations = Math.pow(2, wilds);

  let n = 0;
  for (let i = 0; i < combinations; i++) {
    let j = 0;
    const s = spring.replaceAll('?', () =>
      (i & (1 << j++)) === 0 ? '.' : '#'
    );
    if (check(s, numbers)) n++;
  }

  return n;
}

function check(spring: string, numbers: number[]): boolean {
  const runs = match(spring, /#+/g).map(([m]) => m.length);

  if (runs.length !== numbers.length) return false;

  for (let i = 0; i < runs.length; i++) {
    if (runs[i] !== numbers[i]) return false;
  }
  return true;
}

export function solvePart2(lines: Foo): any {
  return lines;
}
