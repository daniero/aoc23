import { type ReactElement } from 'react';
import { type Cubes } from './day2Solver.ts';

export function Bag({ bag }: { bag: Cubes }): ReactElement {
  return (
    <div>
      <div>R: {bag.red}</div>
      <div>G: {bag.green}</div>
      <div>B: {bag.blue}</div>
    </div>
  );
}
