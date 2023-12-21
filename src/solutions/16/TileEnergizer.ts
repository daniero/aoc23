import { type Reducer } from 'react';
import { bump, type Grid, isInside, type Row, set } from '../../utils/grid.ts';
import { E, N, type Nesw, nesw4Dirs, S, W } from '../../utils/nesw.ts';

type Tile = '.' | '/' | '\\' | '|' | '-';

export interface Node {
  type: Tile;
  energized: number;
  lastVisit: Nesw | null;
  visitedFrom: [boolean, boolean, boolean, boolean];
}

interface Beam {
  x: number;
  y: number;
  dir: Nesw;
  prevDir: Nesw;
}

function moveForward(beam: Beam): Beam {
  const [dx, dy] = nesw4Dirs[beam.dir];
  return {
    ...beam,
    prevDir: beam.dir,
    x: beam.x + dx,
    y: beam.y + dy,
  };
}

function turnRight(beam: Beam): Beam {
  return {
    ...beam,
    prevDir: beam.dir,
    dir: ((beam.dir + 1) % 4) as Nesw,
  };
}
function turnLeft(beam: Beam): Beam {
  return {
    ...beam,
    prevDir: beam.dir,
    dir: ((beam.dir + 3) % 4) as Nesw,
  };
}

export function parseInput(input: string): Grid<Node> {
  return {
    v: 0,
    rows: input
      .trim()
      .split('\n')
      .map<Row<Node>>((line) => ({
        v: 0,
        cols: line.split('').map((c) => ({
          type: c as Tile,
          energized: 0,
          lastVisit: null,
          visitedFrom: [false, false, false, false],
        })),
      })),
  };
}

export interface State {
  done: boolean;
  grid: Grid<Node>;
  energizedTiles: number;
  beams: Beam[];
}

export function initializeState({
  grid,
  start = { x: -1, y: 0, dir: 1, prevDir: 1 },
}: {
  grid: Grid<Node>;
  start?: Beam;
}): State {
  return {
    done: false,
    energizedTiles: 0,
    grid,
    beams: [start],
  };
}

export type StateAction =
  | { type: 'reset'; grid: Grid<Node> }
  | { type: 'tick' };

export const reducer: Reducer<State, StateAction> = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return initializeState({ grid: action.grid });
    }
    case 'tick': {
      if (state.done || state.beams.length === 0) {
        console.log('nothing to do');
        return state;
      }

      const newBeams = state.beams
        .flatMap((beam) => {
          const next = moveForward(beam);
          const tile = state.grid.rows[next.y]?.cols?.[next.x]?.type;

          if (tile === '\\') {
            if (next.dir === 0 || next.dir === 2) {
              return turnLeft(next);
            } else {
              return turnRight(next);
            }
          }
          if (tile === '/') {
            if (next.dir === 0 || next.dir === 2) {
              return turnRight(next);
            } else {
              return turnLeft(next);
            }
          }
          if (
            (tile === '|' && (next.dir === 1 || next.dir === 3)) ||
            (tile === '-' && (next.dir === 0 || next.dir === 2))
          ) {
            return [turnLeft(next), turnRight(next)];
          }

          return next;
        })
        .filter(
          (beam) =>
            isInside(state.grid, beam) &&
            !state.grid.rows[beam.y].cols[beam.x].visitedFrom[beam.prevDir]
        );

      if (newBeams.length === 0) {
        return {
          ...state,
          done: true,
          beams: [],
        };
      }

      let newCount = state.energizedTiles;

      const newGrid: Grid<Node> = newBeams.reduce((oldGrid, beam) => {
        const oldTile: Node = oldGrid.rows[beam.y].cols[beam.x];

        if (!oldTile.visitedFrom[beam.prevDir]) {
          if (!oldTile.energized) {
            newCount++;
          }

          return set(oldGrid, beam, (s) => ({
            ...s,
            energized: s.energized + 1,
            lastVisit: beam.dir,
            visitedFrom: s.visitedFrom.with(
              beam.prevDir,
              true
            ) as Node['visitedFrom'],
          }));
        } else {
          return oldGrid;
        }
      }, bump(state.grid));
      return {
        ...state,
        energizedTiles: newCount,
        grid: newGrid,
        beams: newBeams,
      };
    }
  }
};

export function run(grid: Grid<Node>, start?: Beam): State {
  let state = initializeState({ grid, start });

  while (!state.done) {
    state = reducer(state, { type: 'tick' });
  }
  return state;
}

export function runAll(grid: Grid<Node>): number {
  const x = grid.rows[0].cols.length;
  const y = grid.rows.length;

  const startPositions: Beam[] = [
    ...grid.rows.map((_, y) => ({ x: -1, y, dir: E, prevDir: E })),
    ...grid.rows.map((_, y) => ({ x, y, dir: W, prevDir: W })),
    ...grid.rows[0].cols.map((_, x) => ({ x, y: -1, dir: S, prevDir: S })),
    ...grid.rows[y - 1].cols.map((_, x) => ({ x, y, dir: N, prevDir: N })),
  ];

  let max = -1;
  startPositions.forEach((p) => {
    max = Math.max(max, run(grid, p).energizedTiles);
  });

  return max;
}
