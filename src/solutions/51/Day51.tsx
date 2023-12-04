import {
  type ReactElement,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Button, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import { useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';

export default function Day51(): ReactElement {
  const [run, setRun] = useState(false);

  const frame = useRef<number | null>(null);

  const [foo, bar] = useReducer((s, a) => ({ ...s, count: s.count + a }), {
    count: 0,
  });

  useEffect(() => {
    if (run)
      return () => {
        stop();
      };
  }, []);

  function inc(): void {
    setState((s) => s + 1);
    frame.current = requestAnimationFrame(inc);
  }

  function stop(): void {
    cancelAnimationFrame(frame.current);
    frame.current = null;
  }

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={51} title={'Area 51 test site'} />

        <Button
          onClick={() => {
            if (frame.current === null) {
              inc(null);
            } else {
              stop();
            }
          }}
        >
          {state}
        </Button>
      </Container>
    </>
  );
}

type Foo = ReturnType<typeof parseInput>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  return input.trim().split('\n');
}

export function solvePart1(lines: Foo): any {
  return lines;
}

export function solvePart2(lines: Foo): any {
  return lines;
}
