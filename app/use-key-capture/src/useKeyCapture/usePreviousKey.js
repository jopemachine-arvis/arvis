import { useEffect, useRef } from 'react';

export function usePreviousKey(value) {
  const ref = useRef();

  useEffect(() => {
    if (value.key !== null) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
}
