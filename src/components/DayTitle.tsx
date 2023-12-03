import { type ReactElement } from 'react';
import { Anchor, Group, Text, Title } from '@mantine/core';

interface Props {
  day: number;
  title: string;
}

export function DayTitle({ day, title }: Props): ReactElement {
  const folder = String(day).padStart(2, '0');
  return (
    <Group justify={'space-between'}>
      <Title my={'xl'}>
        Day {day}:{' '}
        <Text
          component={'a'}
          href={'https://adventofcode.com/2023/day/' + day}
          c={'xred'}
          fs={'italic'}
          style={{ fontSize: 24 }}
        >
          {title}
        </Text>
      </Title>
      <Anchor
        c={'xgreen'}
        href={`https://github.com/daniero/aoc23/blob/master/src/solutions/${folder}/Day${day}.tsx`}
      >
        source code
      </Anchor>
    </Group>
  );
}
