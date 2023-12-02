import { type ReactElement } from 'react';
import { Anchor, Card, Container, Title } from '@mantine/core';

export function Welcome(): ReactElement {
  return (
    <Container size={'sm'}>
      <Card my={60} p={30} radius={20}>
        <Title>Welcome!</Title>
        <p>
          This website is made by{' '}
          <Anchor href={'https://www.instagram.com/daniero/'}>
            Daniel Rødskog
          </Anchor>
          . Click the numbered links above to find my solutions to this
          year&apos;s{' '}
          <Anchor c={'xgreen'} href={'https://adventofcode.com/2023'}>
            Advent of Code
          </Anchor>
          ! The source code is available on{' '}
          <Anchor href={'https://github.com/daniero/aoc23'}>GitHub</Anchor>.
        </p>
      </Card>
    </Container>
  );
}
