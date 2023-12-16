import { range } from './arrays.ts';

/**
 * [element, x, y]
 */
type Neighbour<T> = [T, number, number];

export function neighbours<T>(
  grid: T[][],
  x: number,
  y: number
): Array<Neighbour<T>> {
  const yStart = Math.max(0, y - 1);
  const yStop = Math.min(grid.length, y + 2);

  return range(yStart, yStop).flatMap((ny) => {
    const xStart = Math.max(0, x - 1);
    const xStop = Math.min(grid[ny].length, x + 2);

    return range(xStart, xStop)
      .filter((nx) => nx !== x || ny !== y)
      .map((nx) => [grid[ny][nx], nx, ny] as Neighbour<T>);
  });
}

export function isInside(grid: any[][], x: number, y: number): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}
