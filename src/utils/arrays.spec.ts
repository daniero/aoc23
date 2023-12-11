import { it, expect, describe } from 'vitest';
import { loop, pairs, range } from './arrays.ts';

describe('range()', () => {
  it('returns the range of numbers from start up to and excluding stop', () => {
    expect(range(42, 46)).toEqual([42, 43, 44, 45]);
  });

  it('returns empty array when start and stop are equal', () => {
    expect(range(4, 4)).toEqual([]);
  });
});

describe('loop()', () => {
  it('gives empty array for length 0', () => {
    expect(loop(0)).toEqual([]);
  });

  describe('given one parameter', () => {
    it('returns the numbers from 0 up to but excluding the given number', () => {
      expect(loop(3)).toEqual([0, 1, 2]);
    });
  });

  describe('given two parameters `a` and `b`', () => {
    it('returns the numbers from `a` up to but excluding `b`', () => {
      expect(loop(4, 10)).toEqual([10, 11, 12, 13]);
    });
  });
});

describe('pairs', () => {
  it('handles empty input', () => {
    expect(pairs([])).toEqual([]);
  });

  it('works', () => {
    expect(pairs([1, 2, 3])).toEqual([
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
  });
});
