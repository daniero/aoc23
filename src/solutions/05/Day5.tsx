import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';

export default function Day5(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const lines = parseInput(input.value);
  const part1 = solvePart1(lines);
  // const part2 = solvePart2(lines);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={5} title={'If You Give A Seed A Fertilizer'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        {/* <h3>Parsed inpupt</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(lines, undefined, 2)}</Card> */}

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

interface Mapper {
  min: number;
  max: number;
  inc: number;
}

function toMapper(destStart: number, srcStart: number, length: number): Mapper {
  return {
    min: srcStart,
    max: srcStart + length - 1,
    inc: destStart - srcStart,
  };
}

interface ParsedInput {
  seeds: number[];
  categories: Array<{ name: string; mappers: Mapper[] }>;
}

export function parseInput(input: string): ParsedInput {
  const [s, ...c] = input.trim().split('\n\n');

  const seeds = match(s, /\d+/g).map((s) => parseInt(s[0]));

  const categories = c.map((line) => {
    const [head, ...tail] = line.split('\n').map((l) => l.trim());

    const [name] = head.split(' ');

    const mappers = tail.map((line) => {
      const p = line.split(' ').map((w) => parseInt(w));
      return toMapper(...(p as [number, number, number]));
    });

    return { name, mappers };
  });

  return { seeds, categories };
}

export function solvePart1(input: ParsedInput): any {
  const { seeds, categories } = input;

  const trails = seeds.map((seed) => {
    const init = {
      result: seed,
      steps: [] as Array<{ name: string; value: number }>,
    };

    const trail = categories.reduce((prev, category) => {
      const mapper = category.mappers.find(
        (range) => range.min <= prev.result && range.max >= prev.result
      );
      const inc = mapper?.inc ?? 0;

      const nextValue = prev.result + inc;
      return {
        result: nextValue,
        steps: [...prev.steps, { name: category.name, value: nextValue }],
      };
    }, init);

    return { seed, trail };
  });

  return Math.min(...trails.map((t) => t.trail.result));
}

export function solvePart2(input: ParsedInput): any {
  return input;
}
