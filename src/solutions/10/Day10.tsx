import {
  memo,
  type ReactElement,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Card,
  Center,
  Container,
  Group,
  SegmentedControl,
} from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import css from './day10.module.scss';
import { initializeState, parseInput, reducer, S, type Node } from './state.ts';
import { useRefState } from '../../utils/useRefState.ts';

export default function Day10(): ReactElement {
  const [, setPart] = useState<1 | 2>(1);
  const input = useInput([
    ['Large', input2],
    ['Sample', input1],
  ]);
  const grid = useMemo(() => parseInput(input.value), [input]);
  const [state, dispatch] = useReducer(reducer, grid, initializeState);

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
      <Container size={'md'}>
        <DayTitle day={10} title={'Pipe Maze'} />

        <Group justify={'space-between'}>
          <div style={{ flexGrow: 2 }}>
            <Button
              onClick={() => {
                if (state.done) {
                  dispatch({ type: 'reset', grid });
                }
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
          </div>
          <div style={{ flexGrow: 1, visibility: 'hidden' }}>
            <SegmentedControl
              data={[
                { label: 'Part 1', value: '1' },
                { label: 'Part 2', value: '2' },
              ]}
              onChange={(v) => {
                setPart(parseInt(v) as 1 | 2);
              }}
            />
          </div>
          <div style={{ flexGrow: 2, textAlign: 'right' }}>
            <Button
              variant={'subtle'}
              onClick={() => {
                dispatch({ type: 'reset', grid });
              }}
            >
              Reset
            </Button>
          </div>
        </Group>

        <Card mt={'md'}>
          <Center className={state.done ? css.bigFlash : undefined}>
            {state.maxDistance >= 0 ? state.maxDistance : '-'}
          </Center>
        </Card>

        <Card component={'pre'} fz={10} style={{ lineHeight: 1 }}>
          {state.grid.map((row, y) => (
            <Row key={y} row={row} />
          ))}
        </Card>
      </Container>
    </>
  );
}

const Row = memo(function RowComp({ row }: { row: Node[] }): ReactElement {
  return (
    <Center>
      {row.map((col, x) => (
        <Col key={x} col={col} />
      ))}
    </Center>
  );
});

const Col = memo(function ColComp({ col }: { col: Node }): ReactElement {
  let char: string;
  let className: string;

  if (col.dist < 0) {
    className = css.undiscovered;
    char = col.type;
  } else {
    className = css.bigFlash;
    if (col.type === S) className += ' ' + css.start;
    else className += ' ' + css.discovered;

    switch (col.type) {
      case '-': {
        char = '═';
        break;
      }
      case 'F': {
        char = '╔';
        break;
      }
      case '|': {
        char = '║';
        break;
      }
      case 'J': {
        char = '╝';
        break;
      }
      case 'L': {
        char = '╚';
        break;
      }
      case '7': {
        char = '╗';
        break;
      }
      default:
        char = col.type;
    }
  }

  return (
    <span
      className={className}
      title={col.dist >= 0 ? col.dist.toString() : undefined}
    >
      {char}
    </span>
  );
});
