import { match } from '../../utils/regex.ts';

export function brute(spring: string, numbers: number[]): number {
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

export function deepRecurse(spring: string, numbers: number[]): number {
  return rec(spring, 0, 0, numbers);
}

function rec(
  spring: string,
  index: number,
  run: number,
  remaining: number[]
): number {
  // End of search
  if (index >= spring.length) {
    return run === 0 && remaining.length === 0 ? 1 : 0;
  }

  function skip(n: number): number {
    return rec(spring, index + n, 0, remaining);
  }

  function dec(): number {
    return rec(spring, index + 1, run - 1, remaining);
  }

  function startNewRun(): number {
    const newRun = remaining[0];
    return rec(spring, index, newRun, remaining.slice(1));
  }

  const current = spring[index];

  if (current === '.') {
    if (run > 0) return 0;
    return skip(1);
  }

  if (run === 1) {
    if (spring[index + 1] === '#') return 0;
    return skip(2);
  }

  if (run > 1) {
    return dec();
  }

  if (current === '#') {
    return startNewRun();
  }

  if (remaining.length === 0) {
    return skip(1);
  }

  const a = skip(1);
  const b = startNewRun();

  return a + b;
}
