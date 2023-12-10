import { Button, Card, Center, Group, SegmentedControl } from '@mantine/core';
import {
  type ReactElement,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useRefState } from '../../utils/useRefState.ts';
import {
  type HighlightableNumber,
  initializeState,
  mainReducer,
} from './state.ts';
import styles from './styles.module.scss';

export function OasisHistoryExtrapolator({
  log: input,
}: {
  log: number[][];
}): ReactElement {
  const [part, setPart] = useState<1 | 2>(1);
  const log = useMemo(
    () => (part === 1 ? input : input.map((line) => line.reverse())),
    [part, input]
  );

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

  useEffect(() => {
    if (state.done) {
      setRunning(false);
    }
  }, [state.done]);

  useEffect(() => {
    dispatch({ type: 'reset', log });
  }, [log]);

  const outputFontSize = log.length > 20 ? 11 : 16;

  return (
    <>
      <Group justify={'space-between'}>
        <div style={{ flexGrow: 2 }}>
          <Button
            onClick={() => {
              if (state.done) {
                dispatch({ type: 'reset', log });
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
        <div style={{ flexGrow: 1 }}>
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
              dispatch({ type: 'reset', log });
            }}
          >
            Reset
          </Button>
        </div>
      </Group>

      <Card mt={'md'}>
        <Center>
          <span
            key={'s-' + state.sum}
            className={state.sum > 0 ? styles.flash2 : undefined}
          >
            {state.sum !== 0 ? state.sum : '-'}
          </span>
        </Center>
      </Card>

      <Card
        component={'pre'}
        fz={outputFontSize}
        dir={part === 1 ? 'ltr' : 'rtl'}
      >
        {state.processed.map((line, i) => {
          return (
            <div key={'p' + i}>
              {line.map((n, j) => {
                return (
                  <span
                    key={'p' + i + '-' + j}
                    className={n.hl ? styles.extra : undefined}
                  >
                    {n.n}{' '}
                  </span>
                );
              })}
            </div>
          );
        })}
        <div>---</div>
        {state.currentlyProcessing?.map((line, i) => (
          <div key={'c' + i}>
            {line.length === 0 && ' '}
            {line.map((value, j) => {
              const style = valueStyle(value);

              return (
                <span key={'c' + i + '-' + j} className={style}>
                  {value.n}{' '}
                </span>
              );
            })}
          </div>
        ))}
        <div>---</div>
        {state.log.map((line, i) => (
          <div key={'l' + i}>{line.join(' ')}</div>
        ))}
      </Card>
    </>
  );
}

function valueStyle(value: HighlightableNumber): string | undefined {
  switch (value.hl) {
    case 'diff':
      return styles.flash2;
    case 'placeholder':
      return styles.extra + ' ' + styles.flash2;
    case 'sum':
      return styles.extra + ' ' + styles.flash;
  }
  return undefined;
}
