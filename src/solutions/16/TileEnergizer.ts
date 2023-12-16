import { replace } from '../../utils/arrays.ts';
import { type Reducer } from 'react';
import { isInside } from '../../utils/grid.ts';

type Tile = '.' | '/' | '\\' | '|' | '-';

export interface Node {
  type: Tile;
  energized: boolean;
}

type Nesw = 0 | 1 | 2 | 3;

// x,y
const neswDirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as const;

interface Beam {
  x: number;
  y: number;
  dir: Nesw;
}

function moveForward(beam: Beam): Beam {
  const [dx, dy] = neswDirs[beam.dir];
  return {
    ...beam,
    x: beam.x + dx,
    y: beam.y + dy,
  };
}

function turnRight(beam: Beam): Beam {
  const newDir = ((beam.dir + 1) % 4) as Nesw;
  return {
    ...beam,
    dir: newDir,
  };
}
function turnLeft(beam: Beam): Beam {
  const newDir = ((beam.dir + 3) % 4) as Nesw;
  return {
    ...beam,
    dir: newDir,
  };
}

export function parseInput(input: string): Node[][] {
  console.log(input);
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line.split('').map<Node>((c) => ({ type: c as Tile, energized: false }))
    );
}

export interface State {
  done: boolean;
  grid: Node[][];
  energizedTiles: number;
  beams: Beam[];
}

export function initializeState(grid: Node[][]): State {
  return {
    done: false,
    energizedTiles: 0,
    grid,
    beams: [{ x: -1, y: 0, dir: 1 }],
  };
}

export type StateAction = { type: 'reset'; grid: Node[][] } | { type: 'tick' };

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
          const tile = state.grid[next.y]?.[next.x]?.type;

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
        .filter((beam) => isInside(state.grid, beam.x, beam.y));

      let newCount = state.energizedTiles;

      const newGrid = newBeams.reduce((oldGrid, beam) => {
        const oldTile = oldGrid[beam.y][beam.x];

        if (!oldTile.energized) {
          newCount++;
          return energize(oldGrid, beam.x, beam.y);
        } else {
          return oldGrid;
        }
      }, state.grid);

      return {
        ...state,
        energizedTiles: newCount,
        grid: newGrid,
        beams: newBeams,
      };
    }
  }
};

function energize(grid: Node[][], x: number, y: number): Node[][] {
  return replace(grid, y, (row) => {
    return replace(row, x, (s) => ({ ...s, energized: true }));
  });
}
