import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { loop } from '../../utils/arrays.ts';
import { match } from '../../utils/regex.ts';
import { neighbours } from '../../utils/grid.ts';

export default function Day2(): ReactElement {
  const input = useInput([
    ['Sample 1', input1],
    ['Large', input2],
  ]);

  const grid = createGrid(input.value);
  const { sum: part1, gridWithParts } = solvePart1(grid);
  const { sum: part2, gridWithGearRatios: schematics } =
    solvePart2(gridWithParts);

  return (
    <Container size={'sm'}>
      <DayTitle day={3} title={'Gear Ratios'}></DayTitle>
      <h2>Input</h2>
      <InputSelector input={input} />

      <h2>Output</h2>
      <Machine schematics={schematics} />

      <h3>Part 1</h3>
      <Card>{part1}</Card>

      <h3>Part 2</h3>
      <Card>{part2}</Card>
    </Container>
  );
}

function Machine({ schematics }: { schematics: Schematics }): ReactElement {
  return (
    <pre>
      {schematics.map((row) => {
        return (
          <div key={Math.random()}>
            {row.map((e) => {
              if (!e.isPart && !e.gearRatio) {
                return e.char;
              }
              return (
                <span
                  key={'' + e.gearRatio + e.isPart}
                  style={{
                    cursor: 'default',
                    color: e.isPart
                      ? 'var(--mantine-color-xgreen-filled)'
                      : e.gearRatio !== 0
                        ? '#fc0'
                        : 'inherit',
                  }}
                  title={`${e.n ?? e.gearRatio}`}
                >
                  {e.char}
                </span>
              );
            })}
          </div>
        );
      })}
    </pre>
  );
}

interface Node {
  x: number;
  y: number;
  char: string;
  id: symbol | null;
  n: number | null;
}

interface WithIsPart {
  isPart: boolean;
}

interface WithGearRatio {
  gearRatio: number;
}

type Schematics = Array<Array<Node & WithIsPart & WithGearRatio>>;

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

export function solvePart1<T extends Node>(
  grid: T[][]
): { sum: number; gridWithParts: Array<Array<T & WithIsPart>> } {
  let sum = 0;
  const parts = new Map<symbol, T[]>();

  grid.forEach((row) => {
    row.forEach((e) => {
      if (e.id !== null && !parts.has(e.id)) {
        for (const [n] of neighbours(grid, e.x, e.y)) {
          if (n.char !== '.' && !/\d/.test(n.char)) {
            sum += e.n as number;
            parts.set(e.id, [e]);
            break;
          }
        }
      }
    });
  });

  const gridWithParts = grid.map((row) =>
    row.map((e) => {
      return {
        ...e,
        isPart: !!e.id && parts.has(e.id),
      };
    })
  );

  return { sum, gridWithParts };
}

export function solvePart2<T extends Node>(
  grid: T[][]
): { sum: number; gridWithGearRatios: Array<Array<T & WithGearRatio>> } {
  let sum = 0;

  const gridWithGearRatios = grid.map((row) => {
    return row.map((e) => {
      if (e.char === '*') {
        const uniqNeighbours = [
          ...neighbours(grid, e.x, e.y)
            .map(([n]) => n)
            .filter((n) => n.id)
            .reduce((m, n) => m.set(n.id as symbol, n), new Map())
            .values(),
        ];
        if (uniqNeighbours.length === 2) {
          const gearRatio = uniqNeighbours[0].n * uniqNeighbours[1].n;
          sum += gearRatio;
          return { ...e, gearRatio };
        }
      }
      return { ...e, gearRatio: 0 };
    });
  });

  return { sum, gridWithGearRatios };
}
