import { type ReactElement, useState } from 'react';
import { Button, Container, Flex } from '@mantine/core';
import input1 from './input1.txt?raw';
import input2 from './input2.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import { OasisHistoryExtrapolator } from './OasisHistoryExtrapolator.tsx';

export default function Day9(): ReactElement {
  const input = useInput([
    ['Sample', input1],
    ['Large', input2],
  ]);

  const log = parseInput(input.value);
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <Container size={'md'}>
        <DayTitle day={9} title={'Mirage Maintenance'} />

        <OasisHistoryExtrapolator log={log} />

        <Flex justify={'flex-end'}>
          <Button
            variant={showInput ? 'light' : 'subtle'}
            onClick={() => {
              setShowInput((x) => !x);
            }}
          >
            {showInput ? 'Hide input' : 'Edit input'}
          </Button>
        </Flex>

        {showInput && <InputSelector input={input} />}

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

export function parseInput(input: string): number[][] {
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(' ')
        .map((n) => parseInt(n))
    );
}
