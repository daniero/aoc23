import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';
import { by } from '../../utils/arrays.ts';

export default function Day7(): ReactElement {
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
        <DayTitle day={7} title={'Camel Cards'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        {/* <h3>Parsed</h3> */}
        {/* <Card component={'pre'}> */}
        {/*  {JSON.stringify(parsedInput, undefined, 2)} */}
        {/* </Card> */}

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

type HandType = (typeof handTypes)[number];
const handTypes = [
  'High card',
  'One pair',
  'Two pair',
  'Three of a kind',
  'Full house',
  'Four of a kind',
  'Five of a kind',
] as const;

type CardLabel = (typeof cardLabels)[number];
const cardLabels = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
] as const;

type Hands = ReturnType<typeof parseInput>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [c, b] = line.trim().split(' ');

      return { cards: c, bid: parseInt(b) };
    });
}

export function solvePart1(hands: Hands): any {
  const x = hands.map((hand) => {
    const sameKinds = match([...hand.cards].sort().join(''), /(.)\1*/g)
      .map(([f]) => f.length)
      .toSorted()
      .reverse();

    const handType: HandType = (() => {
      const [a, b] = sameKinds;
      if (a === 5) return 'Five of a kind';
      if (a === 4) return 'Four of a kind';
      if (a === 3 && b === 2) return 'Full house';
      if (a === 3) return 'Three of a kind';
      if (a === 2 && b === 2) return 'Two pair';
      if (a === 2) return 'One pair';
      return 'High card';
    })();

    const compare =
      handTypes.indexOf(handType) * 1000000000000 +
      parseInt(
        [...hand.cards]
          .map((c) => cardLabels.indexOf(c as CardLabel) + 10)
          .join('')
      );

    return { ...hand, handType, compare };
  });

  return x
    .toSorted(by((y) => y.compare))
    .reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0);
}

export function solvePart2(lines: Hands): any {
  return lines;
}
