import { describe, expect, it } from 'vitest';
import { parseInput, solvePart1, solvePart2 } from './Day4.tsx';
import input1 from './input1.txt?raw';

describe('Day 4', () => {
  const cards = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(cards)).toEqual(13);
  });

  it('solves part 2', () => {
    expect(solvePart2(cards)).toEqual(30);
  });
});
