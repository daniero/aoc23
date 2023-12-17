import { type ReactElement } from 'react';
import { Card, Container } from '@mantine/core';
import input1 from './input-sample.txt?raw';
import input2 from './input2.txt?raw';
import input3 from './input3.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import {
  type City,
  parseInput,
  type Route,
  solvePart1,
} from './CrucibleConnections.ts';

export default function Day17(): ReactElement {
  const input = useInput(
    [
      ['Tiny', input2],
      ['Small', input3],
      ['Sample', input1],
    ],
    1
  );

  const city = parseInput(input.value);
  const part1 = solvePart1(city);
  // const part2 = solvePart2(city);

  return (
    <>
      <Container size={'xl'}>
        <DayTitle day={17} title={'Clumsy Crucible'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Solution</h2>

        <h3>Part 1</h3>
        <Map city={city} route={part1} />

        {/* <h3>Part 2</h3> */}
        {/* <Card component={'pre'}>{JSON.stringify(part2, undefined, 2)}</Card> */}
      </Container>
    </>
  );
}

function Map({
  city,
  route,
}: {
  city: City;
  route: Route | null;
}): ReactElement {
  const map = city.map((row) =>
    row.map((block) => ({ n: block, visited: false }))
  );

  let path = route;
  while (path !== null) {
    map[path.position.y][path.position.x].visited = true;
    path = path.prev;
  }

  return (
    <Card component={'pre'} fz={13}>
      <div>
        Shortest path: {route?.cost ?? '-'}
        <br />
        <br />
      </div>
      {map.map((row, y) => (
        <div key={y}>
          {row.map((block, x) => (
            <span
              key={x}
              style={block.visited ? { color: 'green' } : undefined}
            >
              {block.n}
            </span>
          ))}
        </div>
      ))}
    </Card>
  );
}
