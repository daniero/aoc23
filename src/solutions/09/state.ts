import { type Reducer } from 'react';
import { loop, replace } from '../../utils/arrays.ts';

export interface HighlightableNumber {
  n: number;
  hl: null | 'diff' | 'placeholder' | 'sum';
}

interface State {
  done: boolean;
  sum: number;
  log: number[][];
  currentlyProcessing: HighlightableNumber[][] | null;
  processed: HighlightableNumber[][];
  actions: StateAction[];
}

export function initializeState(log: number[][]): State {
  return {
    sum: 0,
    done: false,
    processed: [],
    currentlyProcessing: null,
    log,
    actions: [
      ...log.map<StateAction>(() => ({
        type: 'fetchNextHistory',
      })),
      { type: 'clear' },
    ],
  };
}

type DispatchAction =
  | {
      type: 'reset';
      log: number[][];
    }
  | { type: 'tick'; steps: number };

export const mainReducer: Reducer<State, DispatchAction> = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return initializeState(action.log);
    }
    case 'tick': {
      if (state.actions.length === 0) {
        return state;
      }
      const [nextAction, ...restActions] = state.actions;
      return stateReducer({ ...state, actions: restActions }, nextAction);
    }
  }
};

type StateAction =
  | { type: 'fetchNextHistory' }
  | { type: 'checkDiffs' }
  | { type: 'addDiff'; diff: number }
  | { type: 'extrapolate'; row: number }
  | { type: 'collapse' }
  | { type: 'clear' }
  | { type: 'sum' };

function sum(processed: HighlightableNumber[][]): number {
  return processed.map((log) => log.at(-1)?.n ?? 0).reduce((a, b) => a + b, 0);
}

const stateReducer: Reducer<State, StateAction> = (state, action) => {
  switch (action.type) {
    case 'fetchNextHistory': {
      const [nextHistory, ...restLog] = state.log;
      const current = [nextHistory.map((n) => ({ n, hl: null }))];

      const processed = state.currentlyProcessing
        ? [...state.processed, state.currentlyProcessing[0]]
        : state.processed;

      return {
        ...state,
        currentlyProcessing: current,
        processed,
        sum: sum(processed),
        log: restLog,
        actions: [{ type: 'checkDiffs' }, ...state.actions],
      };
    }

    case 'checkDiffs': {
      const current = state.currentlyProcessing;
      if (current === null) return state;

      const lastRow = current[current.length - 1];
      const nextActions = loop(lastRow.length - 1).map<StateAction>((i) => {
        const diff = lastRow[i + 1].n - lastRow[i].n;
        return { type: 'addDiff', diff };
      });

      if (nextActions.every((a) => a.type === 'addDiff' && a.diff === 0)) {
        nextActions.push({ type: 'extrapolate', row: current.length });
      } else {
        nextActions.push({ type: 'checkDiffs' });
      }

      return {
        ...state,
        currentlyProcessing: [...current, []],
        actions: [...nextActions, ...state.actions],
      };
    }

    case 'addDiff': {
      const current = state.currentlyProcessing;
      if (current == null) return state;

      return {
        ...state,
        currentlyProcessing: replace(current, -1, (ns) =>
          ns.concat({ n: action.diff, hl: 'diff' })
        ),
      };
    }

    case 'extrapolate': {
      const current = state.currentlyProcessing;
      if (current == null) return state;

      let value: number;
      if (action.row === current.length - 1) {
        value = 0;
      } else {
        const a = current.at(action.row)?.at(-1)?.n ?? -1;
        const b = current.at(action.row + 1)?.at(-1)?.n ?? -1;
        value = a + b;
      }

      let nextAction: StateAction;
      if (action.row > 0) {
        nextAction = { type: 'extrapolate', row: action.row - 1 };
      } else {
        nextAction = { type: 'collapse' };
      }

      return {
        ...state,
        currentlyProcessing: replace(current, action.row, (ns) =>
          ns.concat({ n: value, hl: action.row === 0 ? 'sum' : 'placeholder' })
        ),
        actions: [nextAction, ...state.actions],
      };
    }

    case 'collapse': {
      const nextActions: StateAction[] =
        state.currentlyProcessing && state.currentlyProcessing.length > 2
          ? [{ type: 'collapse' }, ...state.actions]
          : state.actions;

      return {
        ...state,
        currentlyProcessing: state.currentlyProcessing?.slice(0, -1) ?? null,
        actions: nextActions,
      };
    }

    case 'clear': {
      const processed = state.currentlyProcessing
        ? [...state.processed, state.currentlyProcessing[0]]
        : state.processed;

      return {
        ...state,
        done: true,
        processed,
        sum: sum(processed),
        currentlyProcessing: null,
      };
    }

    case 'sum': {
      return {
        ...state,
        sum: sum(state.processed),
      };
    }
  }
};
