export type UserRole =
  | "super_admin"
  | "owner"
  | "manager"
  | "reception"
  | "accountant"
  | "warden"
  | "housekeeping"
  | "security"
  | "maintenance"
  | "laundry"
  | "cook"
  | "tenant";

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  workspaceIds: string[];
  avatarUrl?: string;
  password?: string;
  username?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  workspaceId: string | null;
  issuedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  session: Session;
  user: User;
  requiresWorkspaceSelection: boolean;
}
