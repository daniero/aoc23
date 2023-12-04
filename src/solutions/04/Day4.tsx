import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';
import { loop } from '../../utils/arrays.ts';

export default function Day4(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const lines = input.value.trim().split('\n');
  const cards = parseInput(lines);
  const part1 = solvePart1(cards);
  const part2 = solvePart2(cards);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={4} title={'Scratchcards'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        <h3>Part 2</h3>
        <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card>
      </Container>
    </>
  );
}

// card id, wins, numbers
type Scratchcard = [number, number[], number[]];

function parseInput(lines: string[]): Scratchcard[] {
  return lines.map((line) => {
    const [c, w, n] = line.split(/[:|]/).map((s) => s.trim());

    const wins = match(w, /\d+/g).map(([s]) => parseInt(s));
    const nums = match(n, /\d+/g).map(([s]) => parseInt(s));

    return [c, wins, nums] as [number, number[], number[]];
  });
}

function countMatches(wins: number[], nums: number[]): number {
  return nums.filter((num) => wins.includes(num)).length;
}

function solvePart1(cards: Scratchcard[]): any {
  return cards
    .map(([, wins, nums]) =>
      Math.floor(Math.pow(2, countMatches(wins, nums) - 1))
    )
    .reduce((a, b) => a + b);
}

function solvePart2(cards: Scratchcard[]): number {
  const totalCopies: [number, Scratchcard] = cards.map((cards) => [1, cards]);

  totalCopies.forEach((n, i) => {
    const copies: number = n[0];
    const card: number = n[1];

    const matches = countMatches(card[1], card[2]);
    loop(copies).forEach(() => {
      loop(matches, i + 1).forEach((j) => {
        totalCopies[j][0] += 1;
      });
    });
  });

  // return totalCopies.map(([n, c]) => [n, c[0]]);
  return totalCopies.reduce((sum, [copies]) => sum + copies, 0);
}
