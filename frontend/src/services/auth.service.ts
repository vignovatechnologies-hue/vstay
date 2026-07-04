import { db } from "@/mock/db";
import { ApiError, delay } from "./http";
import type { LoginCredentials, LoginResult, Session, User } from "@/types/auth";

const MOCK_PASSWORD = "password";

function createSession(user: User, workspaceId: string | null): Session {
  return {
    token: `mock_${user.id}_${Date.now()}`,
    userId: user.id,
    workspaceId,
    issuedAt: new Date().toISOString(),
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const user = db.users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
    const expectedPassword = user?.password || MOCK_PASSWORD;
    if (!user || credentials.password !== expectedPassword) {
      await delay(null, 500);
      throw new ApiError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }
    const requiresWorkspaceSelection = user.role === "owner" && user.workspaceIds.length > 1;
    const initialWorkspaceId =
      user.role === "super_admin"
        ? null
        : requiresWorkspaceSelection
          ? null
          : (user.workspaceIds[0] ?? null);
    const session = createSession(user, initialWorkspaceId);
    return delay({ session, user, requiresWorkspaceSelection });
  },
  async signup(data: {
    fullName: string;
    email: string;
    phone: string;
    hostelName: string;
    planId: "monthly" | "yearly";
  }): Promise<LoginResult> {
    const exists = db.users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      await delay(null, 300);
      throw new ApiError("Email already registered.", 400, "EMAIL_EXISTS");
    }

    const workspaceId = `pg_${data.hostelName.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`;
    const userId = `u_owner_${Date.now()}`;
    const initials =
      data.hostelName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "PG";

    // Create and add new workspace
    const newWorkspace = {
      id: workspaceId,
      name: data.hostelName,
      ownerId: userId,
      city: "Bengaluru",
      address: "12, MG Road, Bengaluru 560001",
      initials,
      totalBeds: 50,
      occupiedBeds: 0,
      accent: "blue" as const,
      planId: data.planId,
      createdAt: new Date().toISOString(),
    };
    db.workspaces.push(newWorkspace);

    // Create and add new Owner user
    const newUser: User = {
      id: userId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: "owner",
      workspaceIds: [workspaceId],
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);

    // Persist changes
    db.save();

    const session = createSession(newUser, workspaceId);
    return delay({ session, user: newUser, requiresWorkspaceSelection: false });
  },
  async logout(): Promise<void> {
    return delay(undefined, 120);
  },
  async me(userId: string): Promise<User> {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");
    return delay(user, 150);
  },
};
