import { match } from '../../utils/regex.ts';
import { by, pairs } from '../../utils/arrays.ts';

type Galaxy = ReturnType<typeof parseInput>[number];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  let n = 1;
  return input
    .trim()
    .split('\n')
    .flatMap((line, y) =>
      match(line.trim(), /#/g).map((m) => ({
        id: n++,
        x: m.index,
        y,
      }))
    );
}

export function solvePart1(galaxies: Galaxy[]): any {
  const maxX = galaxies.toSorted(by((g) => g.x)).at(-1)?.x ?? 0;
  const maxY = galaxies.toSorted(by((g) => g.y)).at(-1)?.y ?? 0;

  const emptyRows: boolean[] = new Array(maxX + 1).fill(true);
  const emptyCols: boolean[] = new Array(maxY + 1).fill(true);

  galaxies.forEach((g) => {
    emptyRows[g.y] = false;
    emptyCols[g.x] = false;
  });

  const expanded = galaxies.map((g) => ({
    id: g.id + 'x',
    x: g.x + emptyCols.filter((empty, x) => empty && x < g.x).length,
    y: g.y + emptyRows.filter((empty, y) => empty && y < g.y).length,
  }));

  return pairs(expanded)
    .map(([a, b]) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y))
    .reduce((a, b) => a + b, 0);
}

export function solvePart2(galaxies: Galaxy[]): any {
  return galaxies;
}
