import { type ReactElement } from 'react';
import { Text } from '@mantine/core';

interface Props {
  day: number;
  title: string;
}

export function DayTitle({ day, title }: Props): ReactElement {
  return (
    <h1>
      Day {day}:{' '}
      <Text
        component={'a'}
        href={'https://adventofcode.com/2023/day/' + day}
        c={'xred'}
        size={'xl'}
        fs={'italic'}
      >
        {title}
      </Text>
    </h1>
  );
}
