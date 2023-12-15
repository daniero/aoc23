import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';

import {
  parseInput,
  solvePart1,
  solvePart2,
} from './HotSpringArrangementFinder.ts';

describe('Day 12', () => {
  const springs = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(springs)).toEqual(21);
  });

  it('solves part 2', () => {
    expect(solvePart2(springs)).toEqual(525152);
  });
});
