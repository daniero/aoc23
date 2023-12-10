import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import { parseInput } from './Day9.tsx';
import { initializeState, mainReducer } from './state.ts';

describe('Day 9', () => {
  const log = parseInput(input1);

  it('solves part 1', () => {
    let state = initializeState(log);

    while (!state.done || state.actions.length > 0) {
      state = mainReducer(state, { type: 'tick', steps: 1 });
    }

    expect(state.sum).toEqual(114);
  });
});
