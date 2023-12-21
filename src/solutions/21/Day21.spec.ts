import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';

import {
  countReachablePlots,
  gardenReducer,
  type GardenState,
  initializeGarden,
  parseInput,
} from './StepCounter.ts';

describe('Part 1', () => {
  const grid = parseInput(input1);
  let state = initializeGarden(grid);
  let i: number = 0;

  function check(state1: GardenState, expected: number): void {
    it(`counts ${expected} plot after ${i} steps`, () => {
      expect(countReachablePlots(state1)).toEqual(expected);
    });
  }

  while (++i <= 6) {
    state = gardenReducer(state, ['step']);

    if (i === 1) check(state, 2);
    if (i === 2) check(state, 4);
    if (i === 6) check(state, 16);
  }
});
