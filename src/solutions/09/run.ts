import { parseInput } from './Day9.tsx';
import { initializeState, mainReducer } from './state.ts';

const part = 1;

const input = require('fs').readFileSync('input1.txt', 'utf8');
const log = parseInput(input);
const reversed = log.map((h) => h.reverse());

let state = initializeState(part === 1 ? log : reversed);

while (!state.done || state.actions.length > 0) {
  state = mainReducer(state, { type: 'tick', steps: 1 });
}

console.log(state.sum);
