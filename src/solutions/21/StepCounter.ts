import {
  at,
  bump,
  find,
  type Grid,
  neighbours,
  set,
} from '../../utils/grid.ts';
import { type Reducer } from 'react';
import { type Coordinate } from '../../utils/nesw.ts';

export interface GardenNode {
  type: 'S' | '.' | '#';
  dist: number;
}

export function parseInput(input: string): Grid<GardenNode> {
  return {
    v: 0,
    rows: input
      .trim()
      .split('\n')
      .map((line) => ({
        v: 0,
        cols: line
          .trim()
          .split('')
          .map((c) => {
            const type = c as GardenNode['type'];
            return {
              type,
              dist: c === 'S' ? 0 : -1,
            };
          }),
      })),
  };
}

export type Action = ['reset', Grid<GardenNode>] | ['step'];

export interface GardenState {
  steps: number;
  visited: Coordinate[][];
  grid: Grid<GardenNode>;
}

export function initializeGarden(grid: Grid<GardenNode>): GardenState {
  const newGrid: Grid<GardenNode> = JSON.parse(JSON.stringify(grid));
  const start = find(newGrid, (n) => n.type === 'S')?.pos;

  return {
    steps: 0,
    visited: [[start as Coordinate]],
    grid: newGrid,
  };
}

export const gardenReducer: Reducer<GardenState, Action> = (
  state,
  [action, payload]
) => {
  switch (action) {
    case 'reset': {
      return initializeGarden(payload);
    }
    case 'step': {
      const current = state.visited[state.steps];
      const found: Coordinate[] = [];
      let newGrid = bump(state.grid);

      current.forEach((pos) => {
        neighbours(state.grid, pos).forEach(([_, np]) => {
          const n = at(newGrid, np);
          if (n.type !== '#' && n.dist <= -1) {
            found.push(np);
            newGrid = set(newGrid, np, (oldNode) => ({
              ...oldNode,
              dist: state.steps + 1,
            }));
          }
        });
      });

      return {
        ...state,
        grid: newGrid,
        steps: state.steps + 1,
        visited: [...state.visited, found],
      };
    }
  }
  return state;
};

export function countReachablePlots(state: GardenState): number {
  let sum = 0;
  // for (let i = state.steps % 2; i <= state.steps; i += 2) {
  //   sum += state.visited[i].length;
  // }
  state.grid.rows.forEach((row) => {
    row.cols.forEach((node) => {
      if (node.dist > -1 && node.dist % 2 === state.steps % 2) sum++;
    });
  });
  return sum;
}
