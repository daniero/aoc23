import { type ReactElement, useState } from 'react';
import { SegmentedControl, Textarea } from '@mantine/core';

export function useInput(inputs: Array<[string, string]>): {
  value: string;
  change: (value: ((prevState: string) => string) | string) => void;
  inputs: Array<[string, string]>;
  select: (i: number) => void;
} {
  const initial = inputs[0]?.[1] ?? '';
  const [value, setValue] = useState(initial);

  function select(i: number): void {
    setValue(inputs[i][1]);
  }

  return {
    value,
    change: setValue,
    inputs,
    select,
  };
}

export function InputSelector({
  input,
}: {
  input: ReturnType<typeof useInput>;
}): ReactElement {
  return (
    <>
      <SegmentedControl
        data={input.inputs.map((data, i) => ({
          value: i.toString(),
          label: data[0],
        }))}
        onChange={(v) => {
          input.select(parseInt(v));
        }}
      />
      <Textarea
        styles={{ input: { fontFamily: 'monospace' } }}
        rows={8}
        value={input.value}
        onInput={(e) => {
          input.change(e.currentTarget.value);
        }}
      />
    </>
  );
}
