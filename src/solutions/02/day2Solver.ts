const merge = (prev: object, next: object): object => ({ ...prev, ...next });

export interface Cubes {
  red: number;
  blue: number;
  green: number;
}

const empty: Cubes = {
  red: 0,
  blue: 0,
  green: 0,
};

export type Game = ReturnType<typeof parseIntput>[number];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseIntput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [header, body] = line.split(':');

      const id = parseInt(header.match(/\d+/)?.[0] ?? '-1');

      const bags = body.split(';').map((subset) => {
        return subset
          .trim()
          .split(',')
          .map((color) => {
            const [count, name] = color.trim().split(' ');
            return { [name]: parseInt(count) };
          })
          .reduce(merge, empty) as Cubes;
      });

      return { id, bags };
    });
}

export function solvePart1(games: Game[]): number {
  return games
    .filter(({ bags }) =>
      bags.every((bag) => bag.red <= 12 && bag.green <= 13 && bag.blue <= 14)
    )
    .map((game) => game.id)
    .reduce((sum, id) => sum + id, 0);
}

export function solvePart2(games: Game[]): number {
  return games
    .map((game) => {
      const minCubes = game.bags.reduce(
        (min, next) => ({
          red: Math.max(min.red, next.red),
          green: Math.max(min.green, next.green),
          blue: Math.max(min.blue, next.blue),
        }),
        empty
      );

      return minCubes.red * minCubes.green * minCubes.blue;
    })
    .reduce((sum, power) => sum + power, 0);
}
