import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import { parseInput, solvePart1, solvePart2 } from './Day7.tsx';

describe('Day 7', () => {
  const grid = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(grid)).toEqual(6440);
  });

  it.skip('solves part 2', () => {
    expect(solvePart2(grid)).toEqual(5905);
  });
});
