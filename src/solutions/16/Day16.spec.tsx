import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';

import { parseInput, run, runAll } from './TileEnergizer.ts';

describe('Day 16', () => {
  const grid = parseInput(input1);

  it('solves part 1', () => {
    const state = run(grid);

    expect(state.energizedTiles).toEqual(46);
  });

  it('solves part 2', () => {
    const max = runAll(grid);

    expect(max).toEqual(51);
  });
});
