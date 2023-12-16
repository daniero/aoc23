import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';

import { initializeState, parseInput, reducer } from './TileEnergizer.ts';

describe('Day 16', () => {
  it('solves part 1', () => {
    const grid = parseInput(input1);

    let state = initializeState(grid);

    while (!state.done) {
      state = reducer(state, { type: 'tick' });
    }

    expect(state.energizedTiles).toEqual(46);
  });
});
