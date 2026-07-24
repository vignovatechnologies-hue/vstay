import type { Session } from "@/types/auth";

const KEY = "vstay.session.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const sessionStorage = {
  read(): Session | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
  write(session: Session): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(KEY, JSON.stringify(session));
  },
  clear(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEY);
  },
  setActiveWorkspace(workspaceId: string): void {
    const current = this.read();
    if (!current) return;
    this.write({ ...current, workspaceId });
  },
};
