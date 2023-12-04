import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import { parseInput, solvePart1, solvePart2 } from './Day51.tsx';

describe.skip('Day 51', () => {
  const grid = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(grid)).toEqual(4361);
  });

  it('solves part 2', () => {
    expect(solvePart2(grid)).toEqual(467835);
  });
});
