import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';
import { lcm } from '../../utils/math.ts';

export default function Day8(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const parsedInput = parseInput(input.value);
  const part1 = solvePart1(parsedInput);
  const part2 = solvePart2(parsedInput);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={8} title={'Haunted Wasteland'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h3>Parsed</h3>
        <Card component={'pre'}>
          {JSON.stringify(parsedInput, undefined, 2)}
        </Card>

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Card component={'pre'}>{JSON.stringify(part1, undefined, 2)}</Card>

        <h3>Part 2</h3>
        <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card>
      </Container>
    </>
  );
}

interface ParsedInput {
  steps: Array<'L' | 'R'>;
  nodes: Record<
    string,
    {
      L: string;
      R: string;
    }
  >;
}

export function parseInput(input: string): ParsedInput {
  const [s, n] = input.trim().split('\n\n');

  const steps = s.split('') as ParsedInput['steps'];

  const nodes = n
    .split('\n')
    .map((line) => match(line, /\w+/g).flat())
    .reduce((map, [a, b, c]) => ({ ...map, [a]: { L: b, R: c } }), {});

  return { steps, nodes };
}

export function solvePart1(input: ParsedInput): any {
  const { steps, nodes } = input;

  let i = 0;
  let current = 'AAA';
  while (true) {
    const nextStep = steps[i++ % steps.length];
    const next = nodes[current][nextStep];
    if (next === 'ZZZ') return i;
    current = next;
  }
}

export function solvePart2(input: ParsedInput): any {
  const { steps, nodes } = input;

  const startNodes = Object.keys(nodes).filter((k) => k.endsWith('A'));

  return startNodes
    .map((node) => {
      let i = 0;
      const zs = [];
      let currentNode = node;
      const visited = new Set();

      while (true) {
        const stepNr = i % steps.length;
        const nextStep = steps[stepNr];

        currentNode = nodes[currentNode][nextStep];
        const hash = `${stepNr}-${currentNode}-${nextStep}`;
        if (visited.has(hash)) return zs;
        visited.add(hash);

        ++i;
        if (currentNode.endsWith('Z')) zs.push(i);
      }
    })
    .flat()
    .reduce(lcm);
}
