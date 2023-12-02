import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';

export default function Index(): ReactElement {
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

const merge = (prev: object, next: object): object => ({ ...prev, ...next });

interface Cubes {
  red: number;
  blue: number;
  green: number;
}

const empty: Cubes = {
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
          .reduce(merge, empty) as Cubes;
      });

      return { game, subsets };
    });
}

function solvePart1(games: Game[]): number {
  return games
    .filter(({ subsets }) =>
      subsets.every(
        ({ blue, green, red }) => red <= 12 && green <= 13 && blue <= 14
      )
    )
    .map((game) => game.game)
    .reduce((a, b) => a + b, 0);
}

function solvePart2(games: Game[]): number {
  return games
    .map((game) => {
      const minCubes = game.subsets.reduce(
        (min, next) => ({
          red: Math.max(min.red, next.red),
          green: Math.max(min.green, next.green),
          blue: Math.max(min.blue, next.blue),
        }),
        empty
      );

      return minCubes.red * minCubes.green * minCubes.blue;
    })
    .reduce((sum, power) => sum + power, 0);
}
