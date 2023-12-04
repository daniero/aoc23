import { type ReactElement, useState } from 'react';
import { Button, Container, Group } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';
import { loop } from '../../utils/arrays.ts';
import { ScratchcardVisualizer } from './ScratchcardVisualizer.tsx';

export default function Day4(): ReactElement {
  const input = useInput([
    ['Large', input2],
    ['Sample', input1],
  ]);

  const [showInput, setShowInput] = useState(false);
  const [run, setRun] = useState(false);
  const [key, setKey] = useState(1);

  const cards = parseInput(input.value);
  // const part1 = solvePart1(cards);
  // const part2 = solvePart2(cards);

  const large = cards.length > 20;

  return (
    <>
      <Container size={large ? 'md' : 'sm'}>
        <DayTitle day={4} title={'Scratchcards'} />

        <Group mt={'xl'} justify="space-between">
          <span>
            <Button
              onClick={() => {
                setShowInput(false);
                setRun((r) => !r);
              }}
            >
              {run ? 'Stop' : 'Run'}
            </Button>
            {!run && (
              <Button
                ml={'sm'}
                variant={'subtle'}
                onClick={() => {
                  setKey((k) => k + 1);
                }}
              >
                Reset
              </Button>
            )}
          </span>

          {!run && (
            <Button
              aria-expanded={showInput}
              variant={showInput ? 'light' : 'subtle'}
              onClick={() => {
                setRun(false);
                setShowInput((x) => !x);
              }}
            >
              {showInput ? 'Hide input' : 'Change input'}
            </Button>
          )}
        </Group>
        {showInput ? (
          <>
            <h2>Input</h2>
            <InputSelector input={input} />
          </>
        ) : (
          <ScratchcardVisualizer
            key={key}
            cards={cards}
            run={run}
            size={large ? 'lg' : 'sm'}
          />
        )}

        {/* <h2>Solution</h2> */}

        {/* <h3>Part 1</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card> */}

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

export interface Scratchcard {
  name: string;
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

      return { name: id, wins, nums };
    });
}

export function countMatches(card: Scratchcard): number {
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
