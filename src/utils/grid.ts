import { replace } from './arrays.ts';

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

export function isInside(grid: Grid<unknown>, x: number, y: number): boolean {
  return (
    y >= 0 && y < grid.rows.length && x >= 0 && x < grid.rows[y].cols.length
  );
}

export function set<T>(
  grid: Grid<T>,
  x: number,
  y: number,
  replaceFn: (v: T) => T
): Grid<T> {
  const row = grid.rows[y];

  if (row.v !== grid.v) {
    return {
      ...grid,
      rows: replace(grid.rows, y, (row) => ({
        v: grid.v,
        cols: replace(row.cols, x, replaceFn),
      })),
    };
  }

  row.cols[x] = replaceFn(row.cols[x]);
  return grid;
}
