import {
  type ReactElement,
  type Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Card } from '@mantine/core';
import { type Scratchcard } from './Day4.tsx';

interface State {
  actions: Action[];
  cards: CardState[];
  display: {
    currentLine: number;
  };
}

interface CardState {
  count: number;
  name: string;
  wins: number[];
  nums: Array<{ num: number; win: boolean }>;
}

function initializeState(cards: Scratchcard[]): State {
  return {
    cards: cards.map((card) => ({
      count: 0,
      name: card.id,
      wins: card.wins,
      nums: card.nums.map((num) => ({
        win: false,
        num,
      })),
    })),
    actions: [{ type: 'wait', time: 200 }, { type: 'init-count' }],
    display: {
      currentLine: 0,
    },
  };
}

type Action =
  | { type: 'init-count' }
  | { type: 'wait'; time: number }
  | { type: 'highlight-number'; index: number }
  | { type: 'add-count'; row: number; amount: number };

const reducer: Reducer<State, number> = (state, timePassed) => {
  if (state.actions.length === 0) return state;

  const [action, ...actions] = state.actions;

  const nextState = {
    ...state,
    actions,
  } as State;

  switch (action.type) {
    case 'wait': {
      if (action.time > timePassed) {
        return {
          ...nextState,
          actions: [
            { type: 'wait', time: action.time - timePassed },
            ...actions,
          ],
        };
      }
      return nextState;
    }
    case 'init-count': {
      return {
        ...nextState,
        actions: [
          ...state.cards.flatMap<Action>((_, i) => [
            {
              type: 'add-count',
              row: i,
              amount: 1,
            },
            { type: 'wait', time: 50 },
          ]),
        ],
      };
    }
    case 'add-count': {
      const row = action.row;
      const card = state.cards[row];
      return {
        ...nextState,
        cards: state.cards.with(row, {
          ...card,
          count: card.count + action.amount,
        }),
      };
    }
  }

  return nextState;
};

interface Props {
  cards: Scratchcard[];
  run: boolean;
  size: 'sm' | 'lg';
}

export function ScratchcardVisualizer({
  cards,
  run,
  size,
}: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, cards, initializeState);

  const running = useRef(run);
  const frame = useRef<number | null>(null);
  const time = useRef<number>(-1);

  const go = useCallback((newTime: number) => {
    const timePassed = time.current < 0 ? 0 : newTime - time.current;
    time.current = newTime;
    dispatch(timePassed);
    return running.current ? requestAnimationFrame(go) : -1;
  }, []);

  useEffect(() => {
    running.current = run;
    if (run) {
      frame.current = requestAnimationFrame(go);
    } else if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
  }, [run]);

  return (
    <>
      <Card component={'pre'} fz={size === 'lg' ? '11' : undefined}>
        {state.cards.map((card) => {
          return (
            <div key={card.name}>
              {(card.count ? `${card.count} x ` : '').toString().padStart(8)}
              <span>{card.name}</span>:{' '}
              {card.wins.map((n) => n.toString().padStart(2)).join(' ')}
              {' | '}
              {card.nums.map((n) => n.num.toString().padStart(2)).join(' ')}
            </div>
          );
        })}
      </Card>
      {/* <pre>{JSON.stringify(state, undefined, 2)}</pre> */}
    </>
  );
}
