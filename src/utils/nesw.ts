export type Nesw = 0 | 1 | 2 | 3;

export const N: Nesw = 0;
export const E: Nesw = 1;
export const S: Nesw = 2;
export const W: Nesw = 3;

export function isOpposite(a: Nesw, b: Nesw): boolean {
  return (a + 2) % 4 === b;
}

export interface Coordinate {
  x: number;
  y: number;
}

export function go(nesw: Nesw, from: Coordinate, dist = 1): Coordinate {
  const dir = nesw4Dirs[nesw];
  return {
    x: from.x + dir[0] * dist,
    y: from.y + dir[1] * dist,
  };
}

export const nesw4Dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;

export const nesw8Dirs = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
] as const;

export type Neighbour<T> = [T, Coordinate, Nesw];

export function neighbours<Tgrid, Tpos extends Coordinate>(
  grid: Tgrid[][],
  pos: Tpos,
  includeDiagonals: boolean = false
): Array<Neighbour<Tgrid>> {
  const dirs = includeDiagonals ? nesw8Dirs : nesw4Dirs;
  const ns: Array<Neighbour<Tgrid>> = [];

  dirs.forEach(([dx, dy], i) => {
    const nx = pos.x + dx;
    const ny = pos.y + dy;

    if (nx >= 0 && ny >= 0 && ny < grid.length && nx < grid[ny].length) {
      // FIXME: `i` is not News if `includeDiagonals`
      ns.push([grid[ny][nx], { x: nx, y: ny }, i as Nesw]);
    }
  });

  return ns;
}
