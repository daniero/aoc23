import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';

export default function Day1(): ReactElement {
  const input = useInput([
    ['Simple', input1],
    ['Overlapping', input2],
  ]);

  const lines = input.value.split('\n');
  const part1 = solvePart1(lines);
  const part2 = solvePart2(lines);

  return (
    <>
      <Container size={'sm'}>
        <DayTitle day={1} title={'Trebuchet?!'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Solution</h2>
        <h3>Part 1</h3>
        <Card>{part1}</Card>
        <h3>Part 2</h3>
        <Card>{part2}</Card>
      </Container>
    </>
  );
}

function solvePart1(lines: string[]): number {
  return lines
    .map((line) => {
      const digits = line.match(/\d/g);
      if (!digits) return 0;

      const firstAndLast = digits[0] + digits[digits.length - 1];
      return parseInt(firstAndLast);
    })
    .reduce((a, b) => a + b, 0);
}

function findDigits(s: string): string {
  const digitPatternWithLookaheadForOverlaps =
    /(?=(one|two|three|four|five|six|seven|eight|nine|))/g;
  return s.replaceAll(
    digitPatternWithLookaheadForOverlaps,
    (x, d: keyof typeof digits) => digits[d]?.toString() ?? x
  );
}

const digits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function solvePart2(value: string[]): number {
  return value
    .map((line) => {
      const withLetterDigits = findDigits(line);
      const digits = withLetterDigits.match(/\d/g);
      if (!digits) return 0;

      const firstAndLast = digits[0] + digits[digits.length - 1];
      return parseInt(firstAndLast);
    })
    .reduce((a, b) => a + b, 0);
}
