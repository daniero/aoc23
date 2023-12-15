import { match } from '../../utils/regex.ts';
import { memo } from '../../utils/functions.ts';

type HotSpringArrangement = [string, number[]];

export function parseInput(input: string): HotSpringArrangement[] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [springs, ns] = line.split(' ');

      const numbers = match(ns, /\d+/g).map(([n]) => parseInt(n));

      return [springs, numbers];
    });
}

export function solvePart1(springs: HotSpringArrangement[]): number {
  return springs
    .map(([spring, numbers]) => findArrangements(spring, numbers))
    .reduce((a, b) => a + b, 0);
}

export function solvePart2(springs: HotSpringArrangement[]): number {
  return springs
    .map(unfold)
    .map(([spring, numbers]) => findArrangements(spring, numbers))
    .reduce((a, b) => a + b, 0);
}

export function unfold([
  spring,
  numbers,
]: HotSpringArrangement): HotSpringArrangement {
  const s = new Array(5).fill(spring).join('?');
  const a = new Array(5).fill(numbers).flat();

  return [s, a];
}

export function findArrangements(spring: string, numbers: number[]): number {
  return rec(spring, numbers, 0, 0);
}

const rec = memo(
  (
    spring: string,
    numbers: number[],
    index: number,
    offset: number
  ): number => {
    if (index >= numbers.length) {
      const endOk = offset >= spring.length || !spring.includes('#', offset);
      return endOk ? 1 : 0;
    }

    const number = numbers[index];
    const pos = findPossiblePositions(spring, offset, number);

    let combos = 0;
    pos.forEach((p) => {
      combos += rec(spring, numbers, index + 1, p + number + 1);
    });
    return combos;
  },
  (s, n, i, o) => s.substring(o) + ':' + n.slice(i).join(',')
);

function findPossiblePositions(
  spring: string,
  offset: number,
  n: number
): number[] {
  const positions: number[] = [];

  let index = offset;
  const last = lastPossiblePosition(spring, offset, n);

  do {
    while (spring[index] === '.') index++;
    if (index > last) break;

    if (
      spring[index + n] !== '#' &&
      !spring.substring(index, index + n).includes('.')
    ) {
      positions.push(index);
    }

    index++;
  } while (index <= last);

  return positions;
}

function lastPossiblePosition(
  spring: string,
  offset: number,
  n: number
): number {
  const indexOfHash = spring.indexOf('#', offset);
  const rightBound = spring.length - n;

  if (indexOfHash <= -1) {
    return rightBound;
  }

  return Math.min(indexOfHash, rightBound);
}
