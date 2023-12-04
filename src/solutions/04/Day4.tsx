import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';

export default function Day4(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const lines = input.value.trim().split('\n');
  const cards = parseInput(lines);
  const part1 = solvePart1(cards);
  const part2 = solvePart2(lines);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={4} title={'Scratchcards'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        {/* <h3>Part 2</h3> */}
        {/* <Card>{part2}</Card> */}
      </Container>
    </>
  );
}

type Scratchcard = [number, number[], number[]];

function parseInput(lines: string[]): Scratchcard[] {
  return lines.map((line) => {
    const [c, w, n] = line.split(/[:|]/).map((s) => s.trim());

    const wins = match(w, /\d+/g).map(([s]) => parseInt(s));
    const nums = match(n, /\d+/g).map(([s]) => parseInt(s));

    return [parseInt(c), wins, nums] as [number, number[], number[]];
  });
}

function solvePart1(cards: Scratchcard[]): any {
  return cards
    .map(([, wins, nums]) =>
      Math.floor(
        Math.pow(2, nums.filter((num) => wins.includes(num)).length - 1)
      )
    )
    .reduce((a, b) => a + b);
}

function solvePart2(cards: Scratchcard[]): number {
  return 0;
}
