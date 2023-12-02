import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';
import { parseIntput, solvePart1, solvePart2 } from './day2Solver.ts';

export default function Day2(): ReactElement {
  const input = useInput([['Sample 1', input1]]);

  const games = parseIntput(input.value);
  const part1 = solvePart1(games);
  const part2 = solvePart2(games);

  return (
    <Container size={'sm'}>
      <DayTitle day={2} title={'Cube Conundrum'}></DayTitle>
      <h2>Input</h2>
      <InputSelector input={input} />

      <h2>Solution</h2>
      <h3>Part 1</h3>
      <Card>{part1}</Card>
      <h3>Part 2</h3>
      <Card>{part2}</Card>
    </Container>
  );
}
