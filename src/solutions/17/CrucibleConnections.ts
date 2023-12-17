type City = number[][];

export function parseInput(input: string): City {
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split('')
        .map((c) => parseInt(c))
    );
}

export function solvePart1(blocks: City): any {
  return blocks;
}

export function solvePart2(blocks: City): any {
  return blocks;
}
