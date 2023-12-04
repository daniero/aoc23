import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';

export default function Day26(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const lines = parseInput(input.value);
  const part1 = solvePart1(lines);
  // const part2 = solvePart2(lines);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={26} title={'Template'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
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
