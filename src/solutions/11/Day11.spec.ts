import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';

import { parseInput, solve } from './GalaxyExpander.ts';

describe('Day 11', () => {
  const grid = parseInput(input1);

  it('solves part 1', () => {
    expect(solve(grid, 1)).toEqual(374);
  });

  it('solves part 2', () => {
    // off by one?!1
    expect(solve(grid, 9)).toEqual(1030);
  });
});
