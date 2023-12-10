import { loop, replace } from '../../utils/arrays.ts';
import { type Reducer } from 'react';

type pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';

export const NS = '|';
export const EW = '-';
export const NE = 'L';
export const NW = 'J';
export const SW = '7';
export const SE = 'F';
export const G = '.';
export const S = 'S';

// x,y
const neswDirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

// n e s w
const pipeConnections: Record<pipe, boolean[]> = {
  [S]: [true, true, true, true],
  [G]: [false, false, false, false],
  [NS]: [true, false, true, false],
  [EW]: [false, true, false, true],
  [NE]: [true, true, false, false],
  [NW]: [true, false, false, true],
  [SW]: [false, false, true, true],
  [SE]: [false, true, true, false],
};

interface QueueItem {
  x: number;
  y: number;
  dist: number;
}

function findNewNeighnours(
  grid: Node[][],
  item: { x: number; y: number; dist: number }
): QueueItem[] {
  const { x, y, dist } = item;

  const newNeighbours: QueueItem[] = [];
  const fromNode = grid[y][x];

  neswDirs.forEach(([dx, dy], toNesw) => {
    const connectsTo = pipeConnections[fromNode.type]?.[toNesw] ?? false;
    if (!connectsTo) return;

    const nx = x + dx;
    const ny = y + dy;
    const toNode = grid[ny][nx];
    const visited = toNode.dist >= 0;
    if (visited) return;

    const fromNesw = (2 + toNesw) % 4;
    const connectsFrom = pipeConnections[toNode.type]?.[fromNesw] ?? false;

    if (connectsFrom) {
      const newDist = dist + 1;
      newNeighbours.push({ x: nx, y: ny, dist: newDist });
    }
  });

  return newNeighbours;
}

export interface Node {
  type: pipe;
  dist: number;
}

export function parseInput(input: string): Node[][] {
  const lines = input.trim().split('\n');
  const yPadding = loop(lines[0].length)
    .map(() => G)
    .join('');

  return [yPadding, ...lines, yPadding].map((line) =>
    (G + line + G)
      .trim()
      .split('')
      .map<Node>((p) => ({ type: p as pipe, dist: -1 }))
  );
}

export interface State {
  done: boolean;
  grid: Node[][];
  maxDistance: number;
  actions: MazeAction[];
  queue: QueueItem[];
}

const SEARCH = { type: 'search' };
const START = { type: 'start' };
export type MazeAction = typeof START | typeof SEARCH;

export function initializeState(maze: Node[][]): State {
  return {
    done: false,
    maxDistance: -1,
    grid: maze,
    actions: [START],
    queue: [],
  };
}

function setDist(grid: Node[][], head: QueueItem): Node[][] {
  return replace(grid, head.y, (row) => {
    return replace(row, head.x, (s) => ({ ...s, dist: head.dist }));
  });
}

export const mazeReducer: Reducer<State, MazeAction> = (state, action) => {
  switch (action.type) {
    case 'start': {
      const { grid } = state;

      let sx = -1;
      let sy = -1;
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          if (grid[y][x].type === S) {
            sy = y;
            sx = x;
          }
        }
      }
      console.log({ sx, sy });
      const start: QueueItem = { x: sx, y: sy, dist: 0 };
      return update(state, start);
    }
    case 'search': {
      if (state.queue.length === 0) return state;
      const [head, ...tail] = state.queue;
      return update({ ...state, queue: tail }, head);
    }
  }
  return state;
};

function update(state: State, next: QueueItem): State {
  const newGrid = setDist(state.grid, next);
  const newItems = findNewNeighnours(state.grid, next);

  return {
    ...state,
    maxDistance: Math.max(state.maxDistance, next.dist),
    grid: newGrid,
    queue: state.queue.concat(newItems),
    actions: [SEARCH, ...state.actions],
  };
}

export type StateAction =
  | { type: 'reset'; grid: Node[][] }
  | { type: 'tick'; steps: number };

export const reducer: Reducer<State, StateAction> = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return initializeState(action.grid);
    }
    case 'tick': {
      if (state.done || state.actions.length === 0) {
        console.log('nothing to do');
        return state;
      }
      const [nextAction, ...restActions] = state.actions;
      return mazeReducer({ ...state, actions: restActions }, nextAction);
    }
  }
};
