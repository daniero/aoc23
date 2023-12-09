import { useCallback, useRef, useState } from 'react';

export function useRefState<T>(
  initial: (() => T) | T
): [T, React.MutableRefObject<T>, (newValue: T) => void] {
  const [state, setState] = useState(initial);
  const ref = useRef(state);

  const cb = useCallback((newValue: T) => {
    ref.current = newValue;
    setState(newValue);
  }, []);

  return [state, ref, cb];
}
