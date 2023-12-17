import Heap from 'heap';
import {
  type Coordinate,
  isOpposite,
  neighbours,
  type Nesw,
} from '../../utils/nesw.ts';
import { memo } from '../../utils/functions.ts';
import { by } from '../../utils/arrays.ts';

export type City = number[][];

export function parseInput(input: string): City {
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split('')
        .map((c) => parseInt(c))
    );
}

export interface Route {
  cost: number;
  position: Coordinate;
  prev: Route | null;
  dir: Nesw;
  steps: number;
}

export function solvePart1(city: City): any {
  // y, x, dir, steps
  const visited: Route[][][][] = city.map((row) => row.map(() => []));
  const mn = memo(neighbours, (_, p) => p.x + p.y * city.length);

  function visit(from: Route): Route | null {
    const col = (visited[from.position.y][from.position.x] ||= []);
    const dirs = (col[from.dir] ||= []);
    const existingRoute = dirs[from.steps];

    if (existingRoute == null) {
      dirs[from.steps] = from;
      return null;
    }

    return existingRoute;
  }

  const queue = new Heap<Route>(by((r) => r.cost));

  queue.push({
    position: { x: 0, y: 0 },
    cost: 0,
    prev: null,
    dir: 999 as Nesw,
    steps: 0,
  });

  const target: Coordinate = { x: city[0].length - 1, y: city.length - 1 };

  do {
    const current = queue.pop() as Route;
    if (current.position.x === target.x && current.position.y === target.y) {
      return current;
    }

    for (const [cost, position, dir] of mn(city, current.position)) {
      if (isOpposite(dir, current.dir)) {
        continue;
      }

      const nextSteps = current.dir === dir ? current.steps + 1 : 1;
      if (nextSteps > 3) {
        continue;
      }

      const next: Route = {
        position,
        cost: current.cost + cost,
        prev: current,
        dir,
        steps: nextSteps,
      };
      const existing = visit(next);

      if (!existing) {
        queue.push(next);
      } else if (existing.cost > next.cost) {
        existing.cost = next.cost;
        existing.prev = current;
        queue.updateItem(existing);
      }
    }
  } while (!queue.empty());

  return null;
}

export function solvePart2(city: City): any {
  return city;
}
