import { replace } from '../../utils/arrays.ts';
import { type Reducer } from 'react';

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
    beams: [{ x: 1, y: 0, dir: 1 }],
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
      return state; // TODO <-----
    }
  }
};

function energize(grid: Node[][], x: number, y: number): Node[][] {
  return replace(grid, y, (row) => {
    return replace(row, x, (s) => ({ ...s, energized: true }));
  });
}
