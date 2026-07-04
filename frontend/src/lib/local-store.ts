import { useCallback, useEffect, useRef, useState } from "react";

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function useLocalState<T>(key: string, seed: T) {
  const [state, setState] = useState<T>(() => read(key, seed));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    write(key, state);
  }, [key, state]);
  const reset = useCallback(() => setState(seed), [seed]);
  return [state, setState, reset] as const;
}

export function useLocalCollection<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useLocalState<T[]>(key, seed);
  const add = useCallback((item: T) => setItems((prev) => [item, ...prev]), [setItems]);
  const update = useCallback(
    (id: string, patch: Partial<T>) =>
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it))),
    [setItems],
  );
  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((it) => it.id !== id)),
    [setItems],
  );
  return { items, setItems, add, update, remove };
}
