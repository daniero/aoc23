import { type ReactElement, useState } from 'react';
import { Anchor, SegmentedControl, Textarea } from '@mantine/core';

export function useInput(
  inputs: Array<[string, string]>,
  initiallySelected: number = 0
): {
  value: string;
  change: (value: ((prevState: string) => string) | string) => void;
  inputs: Array<[string, string]>;
  current: number;
  select: (i: number) => void;
} {
  const initial = inputs[initiallySelected]?.[1] ?? '';
  const [selected, setSelected] = useState(initiallySelected);
  const [value, setValue] = useState(initial);

  function select(i: number): void {
    setValue(inputs[i][1]);
    setSelected(i);
  }

  return {
    value,
    change: setValue,
    inputs,
    current: selected,
    select,
  };
}

export function InputSelector({
  input,
  rows = 8,
  day,
}: {
  input: ReturnType<typeof useInput>;
  rows?: number;
  day?: number;
}): ReactElement {
  return (
    <>
      <SegmentedControl
        mr={'lg'}
        data={input.inputs.map((data, i) => ({
          value: i.toString(),
          label: data[0],
        }))}
        value={input.current.toString()}
        onChange={(v) => {
          input.select(parseInt(v));
        }}
      />

      {day !== undefined && (
        <Anchor
          c={'xgreen'}
          href={'https://adventofcode.com/2023/day/' + day + '/input'}
        >
          Get your own, laaarge input here
        </Anchor>
      )}

      <Textarea
        styles={{ input: { fontFamily: 'monospace' } }}
        rows={rows}
        value={input.value}
        onInput={(e) => {
          input.change(e.currentTarget.value);
        }}
      />
    </>
  );
}
