import { type ReactElement, useState } from 'react';
import { Button, Card, Container, Group } from '@mantine/core';
import input1 from './input-sample.txt?raw';
import input2 from './input2.txt?raw';
import input3 from './input3.txt?raw';
import input4 from './input-samplex4.txt?raw';
import { InputSelector, useInput } from '../../components/InputSelector.tsx';
import { DayTitle } from '../../components/DayTitle.tsx';
import {
  type City,
  parseInput,
  type Route,
  solvePart1,
  solvePart2,
} from './CrucibleConnections.ts';

export default function Day17(): ReactElement {
  const input = useInput(
    [
      ['Tiny', input2],
      ['Small', input3],
      ['Sample', input1],
      ['Medium', input4],
    ],
    3
  );

  const city = parseInput(input.value);
  const [route, setRoute] = useState<Route | null>(null);

  return (
    <>
      <Container size={'xl'}>
        <DayTitle day={17} title={'Clumsy Crucible'} />

        <h2>Input</h2>
        <InputSelector input={input} />

        <h2>Output</h2>

        <Group>
          <Button
            variant={'outline'}
            onClick={() => {
              setRoute(solvePart1(city));
            }}
          >
            Solve part 1
          </Button>
          <Button
            variant={'outline'}
            onClick={() => {
              setRoute(solvePart2(city));
            }}
          >
            Solve part 2
          </Button>
        </Group>

        <Map city={city} route={route} />

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
    const block = map[path.position.y]?.[path.position.x];
    block != null && (block.visited = true);
    path = path.prev;
  }

  return (
    <Card component={'pre'}>
      <div>
        Shortest path: {route?.cost ?? '-'}
        <br />
        <br />
      </div>
      <div style={{ lineHeight: 1.4, fontSize: 10 }}>
        {map.map((row, y) => (
          <div key={y}>
            {row.map((block, x) => (
              <span
                key={x}
                style={
                  block.visited
                    ? {
                        padding: 1,
                        color: 'black',
                        backgroundColor: 'silver',
                      }
                    : {
                        padding: 1,
                        backgroundColor: viridis9[block.n - 1],
                        color: block.n <= 6 ? 'black' : 'silver',
                        opacity: 0.4,
                      }
                }
              >
                {block.n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

const viridis9 = [
  '#fde725',
  '#addc30',
  '#5ec962',
  '#28ae80',
  '#21918c',
  '#2c728e',
  '#3b528b',
  '#472d7b',
  '#440154',
];
