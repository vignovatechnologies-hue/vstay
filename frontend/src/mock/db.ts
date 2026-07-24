import { SEED_USERS } from "./seed/users";
import { SEED_WORKSPACES } from "./seed/workspaces";
import type { User } from "@/types/auth";
import type { Workspace } from "@/types/workspace";

export interface MockEmail {
  id: string;
  from?: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  linkUrl: string;
}

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function readFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota error */
  }
}

// Initial seed loading and saving
const initialUsers = readFromStorage<User[]>("vstay.mockdb.users", SEED_USERS);
const initialWorkspaces = readFromStorage<Workspace[]>("vstay.mockdb.workspaces", SEED_WORKSPACES);
const initialEmails = readFromStorage<MockEmail[]>("vstay.mockdb.emails", []);

export const db = {
  users: initialUsers,
  workspaces: initialWorkspaces,
  emails: initialEmails,

  save(): void {
    writeToStorage("vstay.mockdb.users", this.users);
    writeToStorage("vstay.mockdb.workspaces", this.workspaces);
    writeToStorage("vstay.mockdb.emails", this.emails);
  },
};

export type MockDb = typeof db;
