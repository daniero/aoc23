type Foo = ReturnType<typeof parseInput>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function parseInput(input: string) {
  return input.trim().split('\n');
}

export function solvePart1(lines: Foo): any {
  return lines;
}

export function solvePart2(lines: Foo): any {
  return lines;
}
