import {
  type ReactElement,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Button, Card, Container, Group } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import {
  countReachablePlots,
  type GardenState,
  initializeGarden,
  parseInput,
  gardenReducer,
} from './StepCounter.ts';
import css from './day21.module.scss';
import cx from 'classix';

export default function Day21(): ReactElement {
  const input = useInput(
    [
      ['Sample', input1],
      ['Sample repeated', input2],
    ],
    1
  );

  const parsedInput = useMemo(() => parseInput(input.value), [input.value]);
  const [state, dispatch] = useReducer(
    gardenReducer,
    parsedInput,
    initializeGarden
  );
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    dispatch(['reset', parsedInput]);
  }, [parsedInput]);

  return (
    <>
      <Container size={'md'}>
        <DayTitle day={21} title={'Step Counter'} />

        <h2>Solution</h2>

        <Group justify={'space-between'}>
          <Button
            onClick={() => {
              dispatch(['step']);
            }}
          >
            Step
          </Button>
          <Button
            variant={'subtle'}
            onClick={() => {
              setShowInput((x) => !x);
            }}
          >
            Edit input
          </Button>
        </Group>

        {showInput && (
          <>
            <h2>Input</h2>
            <InputSelector input={input} />
          </>
        )}

        <Card my={'md'} ta={'center'} style={{ lineHeight: 0.75 }}>
          Step: {state.steps} — plots: {countReachablePlots(state)}
        </Card>
        <Garden state={state} />

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

function Garden({ state }: { state: GardenState }): ReactElement {
  return (
    <>
      <Card component={'pre'} fz={10}>
        {state.grid.rows.map((row, y) => (
          <div key={y}>
            {row.cols.map((node, x) => {
              const now = node.dist === state.steps;
              const found = node.dist > -1;
              const active = found && node.dist % 2 === state.steps % 2;

              return (
                <span
                  key={`${y}.${x}`}
                  className={cx(
                    node.type === 'S' ? css.start : found || css.empty,
                    now && css.bigFlash + ' ' + css.found
                  )}
                >
                  {active ? 'O' : node.type}
                </span>
              );
            })}
          </div>
        ))}
      </Card>
    </>
  );
}
