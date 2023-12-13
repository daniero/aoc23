import { describe, expect, it } from 'vitest';
import input1 from './input1.txt?raw';
import bigInput from './input.txt?raw';

import {
  findArrangements,
  parseInput,
  solvePart1,
  solvePart2,
  unfold,
} from './HotSpringArrangementFinder.ts';
import { brute } from './rec.ts';

describe('Day 12', () => {
  const springs = parseInput(input1);

  it('solves part 1', () => {
    expect(solvePart1(springs)).toEqual(21);
  });

  it('solves part 2', () => {
    expect(solvePart2(springs)).toEqual(525152);
  });
});

describe('diff', () => {
  const lines = parseInput(bigInput);

  lines.forEach((line) => {
    const correct = brute(...line);
    it(line.join(' ') + '   = ' + correct, () => {
      console.log(line.join(' '));
      const dope = findArrangements(...line);

      expect(dope).toEqual(correct);
    });
  });
});

describe.skip('findArrangements', () => {
  describe('simple negative', () => {
    it('works for too many #s', () => {
      expect(findArrangements('.##..', [1])).toEqual(0);
    });

    it('works for toooo many #s', () => {
      expect(findArrangements('.#####..', [4])).toEqual(0);
    });

    it('works for too many #s at end', () => {
      expect(findArrangements('...##', [1])).toEqual(0);
    });

    it('works for tooooo many #s at end', () => {
      expect(findArrangements('...#####', [4])).toEqual(0);
    });

    it('works for too few #s at end', () => {
      expect(findArrangements('##', [5])).toEqual(0);
    });

    it('works for too few #s', () => {
      expect(findArrangements('##...', [5])).toEqual(0);
    });

    it('works for multiple groups of #', () => {
      expect(findArrangements('..##..#####..', [2, 3])).toEqual(0);
    });
  });
  describe('simple, no ?', () => {
    it('works for empty input', () => {
      expect(findArrangements('', [])).toEqual(1);
    });

    it('works for only .', () => {
      expect(findArrangements('...', [])).toEqual(1);
    });

    it('works for simple #', () => {
      expect(findArrangements('.#', [1])).toEqual(1);
    });

    it('works for multiple groups of #', () => {
      expect(findArrangements('##..###..', [2, 3])).toEqual(1);
    });
  });

  describe('with ?, no extra possibilities', () => {
    it('works alone', () => {
      expect(findArrangements('?', [1])).toEqual(1);
    });

    it('works all', () => {
      expect(findArrangements('???', [3])).toEqual(1);
    });

    it('works at end', () => {
      expect(findArrangements('..##?', [3])).toEqual(1);
    });

    it('works in middle of block', () => {
      expect(findArrangements('..#?#..', [3])).toEqual(1);
    });

    it('works around', () => {
      expect(findArrangements('..?#?..', [3])).toEqual(1);
    });

    it('works in beginning of block', () => {
      expect(findArrangements('..?##..', [3])).toEqual(1);
    });

    it('works with too few', () => {
      expect(findArrangements('..?#..', [3])).toEqual(0);
    });

    it('works with ??? 4', () => {
      expect(findArrangements('..???.', [4])).toEqual(0);
    });
  });

  describe('multiple', () => {
    it('detects ?? 1', () => {
      expect(findArrangements('??', [1])).toEqual(2);
    });

    it('detects ?.? 1', () => {
      expect(findArrangements('?.?', [1])).toEqual(2);
    });

    it('detects ????? 1', () => {
      expect(findArrangements('?????', [1])).toEqual(5);
    });

    it('detects simple', () => {
      expect(findArrangements('?????', [2])).toEqual(4);
    });

    it('detects ?.?', () => {
      expect(findArrangements('.?.?.', [1, 1])).toEqual(1);
    });

    it('detects ??? 1 1', () => {
      expect(findArrangements('???', [1, 1])).toEqual(1);
    });

    it('detects multpoidsjfg', () => {
      expect(findArrangements('??????', [1, 2])).toEqual(6);
      // #.##..
      // #..##.
      // #...##
      // .#.##.
      // .#..##
      // ..#.##
    });
  });
});

describe('unfold', () => {
  it('works', () => {
    expect(unfold(['.#', [1]])).toEqual(['.#?.#?.#?.#?.#', [1, 1, 1, 1, 1]]);
  });
});
