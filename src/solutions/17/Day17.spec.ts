import { describe, expect, it } from 'vitest';
import input1 from './input-sample.txt?raw';

import { parseInput, solvePart1, solvePart2 } from './CrucibleConnections.ts';

describe('Day 17', () => {
  const grid = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(grid).cost).toEqual(102);
  });

  it.skip('solves part 2', () => {
    expect(solvePart2(grid)).toEqual(467835);
  });
});
