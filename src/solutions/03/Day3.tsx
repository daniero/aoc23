import { Card, Container } from '@mantine/core';
import { type ReactElement } from 'react';
import { DayTitle } from '../../components/DayTitle.tsx';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import input1 from './input1.txt?raw';
import { range } from '../../utils/arrays.ts';

export default function Day2(): ReactElement {
  const input = useInput([['Sample 1', input1]]);

  const part1 = solvePart1(input.value);

  return (
    <Container size={'sm'}>
      <DayTitle day={3} title={'Gear Ratios'}></DayTitle>
      <h2>Input</h2>
      <InputSelector input={input} />

      <h2>Solution</h2>
      <h3>Parsed data</h3>
      <Card>
        <pre>{JSON.stringify(part1, undefined, 2)}</pre>
      </Card>
    </Container>
  );
}

function solvePart1(input: string): any {
  const lines = input.trim().split('\n');
  let sum = 0;

  lines.forEach((line, y) => {
    match(line, /\d+/g).forEach(({ index: x, 0: s }) => {
      const isPartNumber = range(y - 1, y + 2).some((ny) => {
        const inYRange = ny >= 0 && ny < lines.length;
        return (
          inYRange &&
          range(x - 1, x + s.length + 1).some((nx) => {
            const inXrange = nx >= 0 && nx < line.length;
            if (!inXrange) return false;
            const char = lines[ny].charAt(nx);
            return char !== '.' && !/\d/.test(char);
          })
        );
      });

      if (isPartNumber) {
        sum += parseInt(s);
      }
    });
  });

  return sum;
}

function match(s: string, p: RegExp): RegExpExecArray[] {
  if (!p.global) {
    const m = p.exec(s);
    return m ? [m] : [];
  }

  const a = [];
  let m;
  while ((m = p.exec(s))) {
    a.push(m);
  }
  return a;
}
