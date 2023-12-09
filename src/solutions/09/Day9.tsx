import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { OasisHistoryExtrapolator } from './OasisHistoryExtrapolator.tsx';

export default function Day9(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const parsedInput = parseInput(input.value);
  const part1 = solvePart1(parsedInput);
  // const part2 = solvePart2(parsedInput);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={9} title={'Mirage Maintenance'} />

        {/* <h2>Input</h2> */}
        {/* <InputSelector input={input} /> */}

        {/* <h3>Parsed</h3> */}
        {/* <Card component={'pre'}> */}
        {/*  {JSON.stringify(parsedInput, undefined, 2)} */}
        {/* </Card> */}

        {/* <h2>Solution</h2> */}

        {/* <h3>Part 1</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card> */}

        <OasisHistoryExtrapolator log={parsedInput} />

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

export function parseInput(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(' ')
        .map((n) => parseInt(n))
    );
}

export function solvePart1(lines: number[][]): any {
  return lines;
}

export function solvePart2(lines: number[][]): any {
  return lines;
}
