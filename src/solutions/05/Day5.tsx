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
        <DayTitle day={5} title={'Template'} />

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

function toMapper(destStart: number, srcStart: number, length: number) {
  return {
    min: srcStart,
    max: srcStart + length - 1,
    inc: destStart - srcStart,
  };
}

const x = toMapper(50, 98, 2);
console.log(x);

type ParsedInput = ReturnType<typeof parseInput>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  const [s, ...m] = input.trim().split('\n\n');

  const seeds = match(s, /\d+/g).map((s) => parseInt(s));

  const mappers = m.map((line) => {
    const [head, ...tail] = line.split('\n').map((l) => l.trim());

    const [name] = head.split(' ');

    const mappers = tail.map((line) => {
      const p = line.split(' ').map((w) => parseInt(w));
      return toMapper(...(p as [number, number, number]));
    });

    return { name, ranges: mappers };
  });

  return { seeds, mappers };
}

export function solvePart1(lines: ParsedInput): any {
  const { seeds, mappers } = lines;

  const trails = seeds.map((seed) => {
    const init = { current: seed, steps: [] };

    const trail = mappers.reduce(({ current, steps }, mapper) => {
      const inc =
        mapper.ranges.find(
          (range) => range.min <= current && range.max >= current
        )?.inc ?? 0;

      const next = current + inc;
      return { current: next, steps: [...steps, [mapper.name, next]] };
    }, init);

    return { seed, trail: trail.steps };
  });

  return Math.min(...trails.map((t) => t.trail[t.trail.length - 1][1]));
}

export function solvePart2(lines: ParsedInput): any {
  return lines;
}
