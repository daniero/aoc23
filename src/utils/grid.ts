import { replace } from './arrays.ts';
import {
  type Coordinate,
  type Neighbour,
  type Nesw,
  nesw4Dirs,
  nesw8Dirs,
} from './nesw.ts';

export interface Grid<X> {
  v: number;
  rows: Array<Row<X>>;
}

export interface Row<X> {
  v: number;
  cols: X[];
}

export function bump<T>(grid: Grid<T>): Grid<T> {
  return {
    ...grid,
    v: grid.v + 1,
  };
}

export function isInside(grid: Grid<unknown>, p: Coordinate): boolean {
  return (
    p.y >= 0 &&
    p.y < grid.rows.length &&
    p.x >= 0 &&
    p.x < grid.rows[p.y].cols.length
  );
}

export function set<T>(
  grid: Grid<T>,
  pos: Coordinate,
  replaceFn: (v: T) => T
): Grid<T> {
  const row = grid.rows[pos.y];

  if (row.v !== grid.v) {
    return {
      ...grid,
      rows: replace(grid.rows, pos.y, (row) => ({
        v: grid.v,
        cols: replace(row.cols, pos.x, replaceFn),
      })),
    };
  }

  row.cols[pos.x] = replaceFn(row.cols[pos.x]);
  return grid;
}

export function at<T>(grid: Grid<T>, pos: Coordinate): T {
  return grid.rows[pos.y].cols[pos.x];
}

export function find<T>(
  grid: Grid<T>,
  fn: (t: T) => boolean
): { pos: Coordinate; node: T } | undefined {
  for (let y = 0; y < grid.rows.length; y++) {
    const row = grid.rows[y];

    for (let x = 0; x < row.cols.length; x++) {
      const node = row.cols[x];

      if (fn(node)) {
        return {
          pos: { x, y },
          node,
        };
      }
    }
  }
}

export function neighbours<T, Tpos extends Coordinate>(
  grid: Grid<T>,
  pos: Tpos,
  includeDiagonals: boolean = false
): Array<Neighbour<T>> {
  const dirs = includeDiagonals ? nesw8Dirs : nesw4Dirs;
  const ns: Array<Neighbour<T>> = [];

  dirs.forEach(([dx, dy], i) => {
    const nx = pos.x + dx;
    const ny = pos.y + dy;

    if (
      nx >= 0 &&
      ny >= 0 &&
      ny < grid.rows.length &&
      nx < grid.rows[ny].cols.length
    ) {
      // FIXME: `i` is not News if `includeDiagonals`
      ns.push([grid.rows[ny].cols[nx], { x: nx, y: ny }, i as Nesw]);
    }
  });

  return ns;
}
