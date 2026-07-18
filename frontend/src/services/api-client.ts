/**
 * Central API client for the Hostly FastAPI backend.
 * All frontend services import from this file.
 */

export const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "API_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.detail || body.message || "Request failed",
      res.status,
      body.code || "API_ERROR",
    );
  }
  // 204 No Content – nothing to parse
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
