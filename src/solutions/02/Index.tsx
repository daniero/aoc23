import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';

export default function Index(): ReactElement {
  const input = useInput([['Sample 1', input1]]);

  const data = parseIntput(input.value);
  const part1 = solvePart1(data);

  return (
    <Container size={'sm'}>
      <DayTitle day={2} title={'Cube Conundrum'}></DayTitle>
      <h2>Input</h2>
      <InputSelector input={input} />

      <h2>Solution</h2>
      <h3>Part 1</h3>
      <Card>{part1}</Card>
    </Container>
  );
}

const merge = (prev: object, next: object): object => ({ ...prev, ...next });

interface Subset {
  red: number;
  blue: number;
  green: number;
}

const empty: Subset = {
  red: 0,
  blue: 0,
  green: 0,
};

type Game = ReturnType<typeof parseIntput>[number];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function parseIntput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [header, body] = line.split(':');

      const game = parseInt(header.match(/\d+/)?.[0] ?? '-1');

      const subsets = body.split(';').map((subset) => {
        return subset
          .trim()
          .split(',')
          .map((color) => {
            const [count, name] = color.trim().split(' ');
            return { [name]: parseInt(count) };
          })
          .reduce(merge, empty) as Subset;
      });

      return { game, subsets };
    });
}

function solvePart1(data: Game[]): number {
  return data
    .filter(({ subsets }) =>
      subsets.every(
        ({ blue, green, red }) => red <= 12 && green <= 13 && blue <= 14
      )
    )
    .map((game) => game.game)
    .reduce((a, b) => a + b, 0);
}
