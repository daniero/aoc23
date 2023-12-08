import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { match } from '../../utils/regex.ts';
import { loop } from '../../utils/arrays.ts';

export default function Day8(): ReactElement {
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
        <DayTitle day={8} title={'Haunted Wasteland'} />

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

type Foo = ReturnType<typeof parseInput>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  const [steps, n] = input.trim().split('\n\n');

  const nodes = n
    .split('\n')
    .map((line) => match(line, /[A-Z]+/g).flat())
    .reduce((map, [a, b, c]) => ({ ...map, [a]: { L: b, R: c } }), {});

  return { steps, nodes };
}

export function solvePart1(input: Foo): any {
  const { steps, nodes } = input;

  const looped = loop(100)
    .map(() => steps)
    .join('');

  return [...looped].reduce((current, next, i) => {
    const x = nodes[current][next];
    // console.log({ i, current, next, x });
    if (x === 'ZZZ') console.log({ i: i + 1, current, next, x });
    return x;
  }, 'AAA');
}

export function solvePart2(lines: Foo): any {
  return lines;
}
