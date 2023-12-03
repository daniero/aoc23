import { describe, expect, it } from 'vitest';
import { createGrid, solvePart1, solvePart2 } from './Day3.tsx';
import input1 from './input1.txt?raw';

describe('Day 3', () => {
  const grid = createGrid(input1);

  it('solves part 1', () => {
    expect(solvePart1(grid).sum).toEqual(4361);
  });

  it('solves part 2', () => {
    expect(solvePart2(grid).sum).toEqual(467835);
  });
});
