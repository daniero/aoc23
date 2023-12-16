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
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import style from './day16.module.scss';
import {
  initializeState,
  type Node,
  parseInput,
  reducer,
} from './TileEnergizer.ts';
import { useRefState } from '../../utils/useRefState.ts';

export default function Day16(): ReactElement {
  const [, setPart] = useState<1 | 2>(1);
  const [showInput, setShowInput] = useState(false);

  const input = useInput([['Sample', input1]]);
  const grid = useMemo(() => parseInput(input.value), [input.value]);

  const [state, dispatch] = useReducer(reducer, grid, initializeState);

  const [runState, runRef, setRunning] = useRefState(false);
  const frame = useRef<number>();

  useEffect(() => {
    function run(): void {
      if (runRef.current) {
        dispatch({ type: 'tick' });
      }
      requestAnimationFrame(run);
    }

    frame.current = requestAnimationFrame(run);

    return () => {
      frame.current != null && cancelAnimationFrame(frame.current);
    };
  }, [runRef]);

  useEffect(() => {
    dispatch({ type: 'reset', grid });
  }, [grid]);

  return (
    <>
      <Container size={'md'}>
        <DayTitle day={16} title={'The Floor Will Be Lava'} />

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
                dispatch({ type: 'tick' });
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
                setShowInput((x) => !x);
              }}
            >
              {showInput ? 'Hide' : 'Edit'} input
            </Button>
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

        {showInput && (
          <>
            <h2>Input</h2>
            <InputSelector input={input} rows={10} />
          </>
        )}

        <Card mt={'md'}>
          <Center className={state.done ? style.bigFlash : undefined}>
            {state.energizedTiles > 0 ? state.energizedTiles : '-'}
          </Center>
        </Card>

        <Card component={'pre'} fz={12} style={{ lineHeight: 1 }}>
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
  let className;

  if (col.type === '.') {
    className = style.empty;
  } else if (col.energized) {
    className = style.bigFlash + ' ' + style.energized;
  } else {
    className = undefined;
  }

  return (
    <span className={className}>
      {col.energized ? '#' : col.type === '.' ? '·' : col.type}
    </span>
  );
});
