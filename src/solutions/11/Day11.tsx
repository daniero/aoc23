import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { parseInput, solve } from './GalaxyExpander.ts';

export default function Day11(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const parsedInput = parseInput(input.value);
  const part1 = solve(parsedInput, 1);
  const part2 = solve(parsedInput, 999999); // off by one?!

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={11} title={'Cosmic Expansion'} />

        <h2>Input</h2>
        <InputSelector input={input} rows={10} />

        {/* <h3>Parsed</h3> */}
        {/* <Card component={'pre'}> */}
        {/*  {JSON.stringify(parsedInput, undefined, 2)} */}
        {/* </Card> */}

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        <h3>Part 2</h3>
        <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card>
      </Container>
    </>
  );
}
