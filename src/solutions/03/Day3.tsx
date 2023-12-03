import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';
import { loop } from '../../utils/arrays.ts';
import { match } from '../../utils/regex.ts';
import { neighbours } from '../../utils/grid.ts';

export default function Day2(): ReactElement {
  const input = useInput([['Sample 1', input1]]);

  const grid = createGrid(input.value);
  const part1 = solvePart1(grid);
  const part2 = solvePart2(grid);

  return (
    <Container size={'sm'}>
      <DayTitle day={3} title={'Gear Ratios'}></DayTitle>
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

interface Node {
  x: number;
  y: number;
  char: string;
  id: symbol | null;
  n: number | null;
}

export function createGrid(input: string): Node[][] {
  const lines = input.trim().split('\n');

  const grid = lines.map((line, y) => {
    const trimmed = line.trimEnd();
    return loop(trimmed.length).map((x) => ({
      id: null as symbol | null,
      x,
      y,
      char: trimmed.charAt(x),
      n: null as number | null,
    }));
  });

  lines.forEach((line, y) => {
    match(line, /\d+/g).forEach(({ index: x, 0: s }) => {
      const n = parseInt(s);
      const id = Symbol(n);

      loop(s.length, x).forEach((x) => {
        grid[y][x].n = n;
        grid[y][x].id = id;
      });
    });
  });

  return grid;
}

export function solvePart1(grid: Node[][]): number {
  let sum = 0;
  const visitedNumbers = new Set<symbol>();

  grid.forEach((row) => {
    row.forEach((e) => {
      if (e.id !== null && !visitedNumbers.has(e.id)) {
        for (const [n] of neighbours(grid, e.x, e.y)) {
          if (n.char !== '.' && !/\d/.test(n.char)) {
            sum += e.n as number;
            visitedNumbers.add(e.id);
            break;
          }
        }
      }
    });
  });

  return sum;
}

export function solvePart2(grid: Node[][]): number {
  let sum = 0;
  grid.forEach((row) => {
    row.forEach((e) => {
      if (e.char === '*') {
        const uniqNeighbours = [
          ...neighbours(grid, e.x, e.y)
            .map(([n]) => n)
            .filter((n) => n.id)
            .reduce((m, n) => m.set(n.id as symbol, n), new Map())
            .values(),
        ];
        if (uniqNeighbours.length === 2) {
          sum += uniqNeighbours[0].n * uniqNeighbours[1].n;
        }
      }
    });
  });
  return sum;
}
