import {
  type ReactElement,
  type Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Card, SimpleGrid } from '@mantine/core';
import { type Scratchcard } from './Day4.tsx';
import styles from './styles.module.scss';

interface State {
  actions: Action[];
  cards: CardState[];
  done: boolean;
  part1: number;
  part2: number;
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
      name: card.name,
      wins: card.wins,
      nums: card.nums.map((num) => ({
        win: false,
        num,
      })),
    })),
    actions: [
      { type: 'wait', time: 150 },
      { type: 'initCounts', startRow: 0 },
      { type: 'initNumberChecks' },
    ],
    done: false,
    part1: 0,
    part2: 0,
  };
}

type Action =
  | { type: 'wait'; time: number }
  | { type: 'initCounts'; startRow: number }
  | { type: 'incCount'; row: number; amount: number }
  | { type: 'initNumberChecks' }
  | { type: 'checkNumbers'; row: number }
  | { type: 'highlightNumber'; row: number; index: number }
  | { type: 'stop'; row: number; index: number };

const reducer: Reducer<State, number> = (state, timePassed) => {
  if (state.actions.length === 0) return { ...state, done: true };

  // Pick an action at random???
  const [action, ...actions] = state.actions;

  const nextState: State = {
    ...state,
    actions,
  };

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
    case 'initCounts': {
      const startRow = action.startRow;
      const stopRow = Math.min(state.cards.length, startRow * 2 + 1);

      return {
        ...nextState,
        cards: state.cards.map((card, i) =>
          i >= startRow && i < stopRow
            ? {
                ...card,
                count: 1,
              }
            : card
        ),
        actions:
          stopRow < state.cards.length
            ? [
                {
                  type: 'initCounts',
                  startRow: stopRow,
                },
                ...actions,
              ]
            : actions,
        part2: state.part2 + stopRow - startRow,
      };
    }
    case 'initNumberChecks': {
      return {
        ...nextState,
        actions: [
          ...state.cards.map<Action>((_, i) => ({
            type: 'checkNumbers',
            row: i,
          })),
          ...actions,
        ],
      };
    }
    case 'checkNumbers': {
      const row = action.row;
      const card = state.cards[row];
      let wins = 0;
      const newActions: Action[] = [];
      card.nums.forEach(({ num }, index) => {
        if (card.wins.includes(num)) {
          wins += 1;
          newActions.push({ type: 'highlightNumber', row, index });
          newActions.push({
            type: 'incCount',
            row: row + wins,
            amount: card.count,
          });
        }
      });
      const points = Math.floor(Math.pow(2, wins - 1));
      return {
        ...nextState,
        actions: [...newActions, ...actions],
        part1: state.part1 + points,
      };
    }
    case 'highlightNumber': {
      const { row, index } = action;
      const card = state.cards[row];
      const num = card.nums[index];
      return {
        ...nextState,
        cards: state.cards.with(action.row, {
          ...card,
          nums: card.nums.with(action.index, { ...num, win: true }),
        }),
      };
    }
    case 'incCount': {
      const { row, amount } = action;
      if (row >= state.cards.length) return nextState;
      const card = state.cards[row];
      return {
        ...nextState,
        cards: state.cards.with(row, {
          ...card,
          count: card.count + amount,
        }),
        part2: state.part2 + amount,
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

  const fontSize = size === 'lg' ? '11' : undefined;

  return (
    <>
      <Card component={'pre'} fz={fontSize}>
        <SimpleGrid
          cols={4}
          classNames={state.done ? { root: styles.flash2 } : undefined}
        >
          <div></div>
          <div>
            Part 1: <span key={'p1' + state.part1}>{state.part1}</span>
          </div>
          <div>
            Part 2: <span key={'p2' + state.part2}>{state.part2}</span>
          </div>
          <div></div>
        </SimpleGrid>
      </Card>
      <Card component={'pre'} fz={fontSize}>
        {state.cards.map((card) => {
          return (
            <div key={card.name}>
              {card.count ? (
                <>
                  <span
                    key={card.name + '.' + card.count}
                    className={card.count > 0 ? styles.flash2 : undefined}
                  >
                    {card.count.toString().padStart(8)}
                  </span>
                  {' x '}
                </>
              ) : (
                '           '
              )}
              <span>{card.name}</span>:{' '}
              {card.wins.map((n) => n.toString().padStart(2)).join(' ')}
              {' |'}
              {card.nums.map((n, i) => (
                <span key={i} className={n.win ? styles.win : undefined}>
                  {n.num.toString().padStart(3)}
                </span>
              ))}
            </div>
          );
        })}
      </Card>
    </>
  );
}
