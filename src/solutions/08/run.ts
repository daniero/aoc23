import { parseInput, solvePart2 } from './Day8.tsx';

const input = require('fs').readFileSync('input2.txt', 'utf8');

const parsed = parseInput(input);
console.log(solvePart2(parsed));
