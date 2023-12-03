import { describe, expect, it } from 'vitest';
import { createGrid, solvePart1 } from './Day3.tsx';
import input1 from './input1.txt?raw';

describe('part 1', () => {
  it('works', () => {
    expect(solvePart1(createGrid(input1))).toEqual(4361);
  });
});
