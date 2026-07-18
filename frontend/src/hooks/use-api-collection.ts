/**
 * useApiCollection
 *
 * React hook that loads a collection from a backend API endpoint,
 * and exposes add / update / remove functions that call the API.
 *
 * Usage:
 *   const { items, loading, add, update, remove } =
 *     useApiCollection<Room>("/api/rooms", { workspaceId: ws.id });
 */
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/services/api-client";
import { toast } from "sonner";

interface UseApiCollectionOptions {
  /** Query params appended to GET request (e.g. {workspaceId: "pg_1"}) */
  params?: Record<string, string | null | undefined>;
  /** Set to false to skip fetching (e.g. while workspace not yet loaded) */
  enabled?: boolean;
}

export function useApiCollection<T extends { id: string }>(
  basePath: string,
  options: UseApiCollectionOptions = {},
) {
  const { params = {}, enabled = true } = options;
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // Build query string from params
  const queryString = Object.entries(params)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
    .join("&");
  const listUrl = queryString ? `${basePath}?${queryString}` : basePath;

  // Load items from API
  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const data = await apiFetch<T[]>(listUrl);
      setItems(data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [listUrl, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  // Create
  const add = useCallback(
    async (payload: Omit<T, "id">) => {
      const created = await apiFetch<T>(basePath, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setItems((prev) => [created, ...prev]);
      return created;
    },
    [basePath],
  );

  // Update
  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const updated = await apiFetch<T>(`${basePath}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      return updated;
    },
    [basePath],
  );

  // Delete
  const remove = useCallback(
    async (id: string) => {
      await apiFetch<void>(`${basePath}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    },
    [basePath],
  );

  return { items, loading, reload: load, add, update, remove };
}
