/**
 * useLocalState / useLocalCollection
 *
 * Drop-in replacement for simple localStorage hooks that ALSO syncs
 * state to the Hostly backend (/api/settings) so every button action
 * is persisted in PostgreSQL.
 *
 * On mount  → fetch latest value from server; fall back to seed if missing
 * On change → debounced POST to server (+ immediate localStorage write)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { sessionStorage as hostlySession } from "@/lib/session-storage";

const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

// ─── localStorage helpers ─────────────────────────────────────────────────────

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function lsRead<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsWrite<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota */ }
}

// ─── Backend helpers ──────────────────────────────────────────────────────────

async function fetchFromServer<T>(
  key: string,
  userId?: string | null,
  workspaceId?: string | null,
): Promise<T | null> {
  try {
    let url = `${API_BASE}/api/settings?key=${encodeURIComponent(key)}`;
    if (userId) url += `&userId=${encodeURIComponent(userId)}`;
    if (workspaceId) url += `&workspaceId=${encodeURIComponent(workspaceId)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data as T;
  } catch {
    return null;
  }
}

function saveToServer(
  key: string,
  value: unknown,
  userId?: string | null,
  workspaceId?: string | null,
) {
  fetch(`${API_BASE}/api/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value, userId, workspaceId }),
  }).catch(() => { /* fire-and-forget */ });
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useLocalState<T>(key: string, seed: T) {
  const [state, setState] = useState<T>(() => lsRead(key, seed));
  const initialised = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read session from localStorage directly (safe on server and avoids
  // hook-order issues when this hook is called outside AuthProvider)
  const session = isBrowser() ? hostlySession.read() : null;
  const userId = session?.userId ?? null;
  const workspaceId = session?.workspaceId ?? null;

  // 1️⃣  Hydrate from server on mount (or when key/user/workspace changes)
  useEffect(() => {
    initialised.current = false;
    let cancelled = false;

    fetchFromServer<T>(key, userId, workspaceId).then((serverValue) => {
      if (cancelled) return;
      if (serverValue !== null && serverValue !== undefined) {
        setState(serverValue);
        lsWrite(key, serverValue);
      } else {
        // No server value yet → push local seed to server
        saveToServer(key, lsRead(key, seed), userId, workspaceId);
      }
      initialised.current = true;
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, userId, workspaceId]);

  // 2️⃣  Persist on every state change (debounced 300 ms)
  useEffect(() => {
    if (!initialised.current) return;   // skip the initial hydration write
    lsWrite(key, state);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToServer(key, state, userId, workspaceId);
    }, 300);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const reset = useCallback(() => setState(seed), [seed]);
  return [state, setState, reset] as const;
}

// ─── Collection hook ──────────────────────────────────────────────────────────

export function useLocalCollection<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useLocalState<T[]>(key, seed);

  const add = useCallback(
    (item: T) => setItems((prev) => [item, ...prev]),
    [setItems],
  );
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
