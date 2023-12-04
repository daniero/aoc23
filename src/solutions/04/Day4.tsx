import { type ReactElement, useState } from 'react';
import { Button, Card, Container, Group } from '@mantine/core';
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

  const [showInput, setShowInput] = useState(false);
  const [run, setRun] = useState(false);

  const cards = parseInput(input.value);
  const part1 = solvePart1(cards);
  const part2 = solvePart2(cards);

  return (
    <>
      <Container size={input.current === 1 ? 'md' : 'sm'}>
        <DayTitle day={4} title={'Scratchcards'} />

        <Group mt={'xl'} justify="space-between">
          <Button
            onClick={() => {
              setShowInput(false);
              setRun((r) => !r);
            }}
          >
            {run ? 'Stop' : 'Run'}
          </Button>

          <Button
            color={'xgreen'}
            variant={'subtle'}
            onClick={() => {
              setRun(false);
              setShowInput((x) => !x);
            }}
          >
            {showInput ? 'Hide input' : 'Edit input'}
          </Button>
        </Group>
        {showInput ? (
          <>
            <h2>Input</h2>
            <InputSelector input={input} />
          </>
        ) : (
          <Card component={'pre'} fz={input.current === 1 ? '12' : undefined}>
            {cards.map((card) => {
              return (
                <div key={card.id}>
                  {(run ? '1' : ' ').toString().padStart(8)}
                  {run ? ' x ' : '   '}
                  <span>{card.id}</span>:{' '}
                  {card.wins.map((n) => n.toString().padStart(2)).join(' ')}
                  {' | '}
                  {card.nums.map((n) => n.toString().padStart(2)).join(' ')}
                </div>
              );
            })}
          </Card>
        )}

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        <h3>Part 2</h3>
        <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card>
      </Container>
    </>
  );
}

interface Scratchcard {
  id: string;
  wins: number[];
  nums: number[];
}

export function parseInput(input: string): Scratchcard[] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [id, w, n] = line.split(/[:|]/).map((s) => s.trim());

      const wins = match(w, /\d+/g).map(([s]) => parseInt(s));
      const nums = match(n, /\d+/g).map(([s]) => parseInt(s));

      return { id, wins, nums };
    });
}

function countMatches(card: Scratchcard): number {
  return card.nums.filter((num) => card.wins.includes(num)).length;
}

export function solvePart1(cards: Scratchcard[]): number {
  return cards
    .map((card) => Math.floor(Math.pow(2, countMatches(card) - 1)))
    .reduce((a, b) => a + b);
}

export function solvePart2(cards: Scratchcard[]): number {
  const totalCopies = cards.map((cards) => [1, cards] as [number, Scratchcard]);

  totalCopies.forEach(([copies, card], i) => {
    const matches = countMatches(card);

    loop(matches, i + 1).forEach((j) => {
      totalCopies[j][0] += copies;
    });
  });

  return totalCopies.reduce((sum, [copies]) => sum + copies, 0);
}

// 1073 too low
