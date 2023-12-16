import { parseInput, solvePart2 } from './HotSpringArrangementFinder.ts';

const input = require('fs').readFileSync('input1.txt', 'utf8');

const parsed = parseInput(input);
const part1 = solvePart2(parsed);

console.log(part1);
