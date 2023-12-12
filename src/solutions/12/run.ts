import { parseInput, solvePart1 } from './Foo.ts';

const input = require('fs').readFileSync('input.txt', 'utf8');

const parsed = parseInput(input);
const part1 = solvePart1(parsed);

console.log(part1);
