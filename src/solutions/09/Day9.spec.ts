import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import { parseInput } from './Day9.tsx';
import { initializeState, mainReducer } from './state.ts';

describe('Day 9', () => {
  it('solves part 1', () => {
    const log = parseInput(input1);

    let state = initializeState(log);

    while (!state.done || state.actions.length > 0) {
      state = mainReducer(state, { type: 'tick', steps: 1 });
    }

    expect(state.sum).toEqual(114);
  });

  it('solves part 2 by reversing each line', () => {
    const log = parseInput(input1);
    const reversed = log.map((h) => h.reverse());

    let state = initializeState(reversed);

    while (!state.done || state.actions.length > 0) {
      state = mainReducer(state, { type: 'tick', steps: 1 });
    }

    expect(state.sum).toEqual(2);
  });
});
