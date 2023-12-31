import { parseInput, solvePart2 } from './CrucibleConnections.ts';

const input = require('fs').readFileSync('input-sample.txt', 'utf8');
// const input = require('fs').readFileSync('input-actual.txt', 'utf8');

const parsed = parseInput(input);
const part1 = solvePart2(parsed);

console.log(part1?.cost);
