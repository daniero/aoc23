import { type Reducer } from 'react';
import { bump, type Grid, isInside, type Row, set } from '../../utils/grid.ts';
import { type Nesw, nesw4Dirs } from '../../utils/nesw.ts';

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

export function initializeState(grid: Grid<Node>): State {
  return {
    done: false,
    energizedTiles: 0,
    grid,
    beams: [{ x: -1, y: 0, dir: 1, prevDir: 1 }],
  };
}

export type StateAction =
  | { type: 'reset'; grid: Grid<Node> }
  | { type: 'tick' };

export const reducer: Reducer<State, StateAction> = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return initializeState(action.grid);
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
            isInside(state.grid, beam.x, beam.y) &&
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

          return set(oldGrid, beam.x, beam.y, (s) => ({
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
