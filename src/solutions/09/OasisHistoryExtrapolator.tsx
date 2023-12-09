import { Button, Card, Group } from '@mantine/core';
import {
  type ReactElement,
  type Reducer,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useRefState } from '../../utils/useRefState.ts';

interface State {
  sum: number;
  log: number[][];
  actions: StateAction[];
}

function initializeState(log: number[][]): State {
  return {
    sum: 0,
    log,
    actions: [
      { type: 'foo', payload: 123 },
      { type: 'foo', payload: 456 },
    ],
  };
}

type DispatchAction =
  | {
      type: 'reset';
      log: number[][];
    }
  | { type: 'tick'; steps: number };

type StateAction =
  | {
      type: 'foo';
      payload: number;
    }
  | {
      type: 'bar';
      payload: string;
    };

const mainReducer: Reducer<State, DispatchAction> = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initializeState(action.log);
    case 'tick': {
      if (state.actions.length === 0) return state;
      const [nextAction, ...restActions] = state.actions;
      return stateReducer({ ...state, actions: restActions }, nextAction);
    }
  }
};

const stateReducer: Reducer<State, StateAction> = (state, action) => {
  switch (action.type) {
    // TODO --- actually do something here
    case 'foo': {
      return { ...state, log: [...state.log, [action.payload]] };
    }
    case 'bar': {
      return state;
    }
  }
};

export function OasisHistoryExtrapolator({
  log,
}: {
  log: number[][];
}): ReactElement {
  const [state, dispatch] = useReducer(mainReducer, log, initializeState);

  const [runState, runRef, setRunning] = useRefState(false);
  const frame = useRef<number>();

  useEffect(() => {
    function run(): void {
      if (runRef.current) {
        dispatch({ type: 'tick', steps: 1 });
      }
      requestAnimationFrame(run);
    }

    frame.current = requestAnimationFrame(run);

    return () => {
      frame.current != null && cancelAnimationFrame(frame.current);
    };
  }, [runRef]);

  return (
    <>
      <Group justify={'space-between'}>
        <span>
          <Button
            onClick={() => {
              setRunning(!runState);
            }}
          >
            {runState ? 'Stop' : 'Run'}
          </Button>
          <Button
            ml={'sm'}
            variant={'light'}
            onClick={() => {
              dispatch({ type: 'tick', steps: 1 });
            }}
          >
            Step
          </Button>
        </span>
        <Button
          variant={'subtle'}
          onClick={() => {
            setRunning(false);
            dispatch({ type: 'reset', log });
          }}
        >
          Reset
        </Button>
      </Group>

      <Card component={'pre'}>
        {state.log.map((line, i) => (
          <div key={i}>{line.join(' ')}</div>
        ))}
      </Card>
    </>
  );
}
