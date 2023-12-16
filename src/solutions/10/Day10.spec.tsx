import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import input4 from './input4.txt?raw';

import { initializeState, parseInput, reducer } from './state.ts';

describe('Day 10', () => {
  it('solves part 1 for tiny input', () => {
    const grid = parseInput(input1);

    let state = initializeState(grid);

    while (!state.done) {
      state = reducer(state, { type: 'tick', steps: 1 });
    }

    expect(state.maxDistance).toEqual(8);
  });

  it('solves part 1 for larger input', () => {
    const grid = parseInput(input4);

    let state = initializeState(grid);

    while (!state.done) {
      state = reducer(state, { type: 'tick', steps: 1 });
    }

    expect(state.maxDistance).toEqual(514);
  });
});
