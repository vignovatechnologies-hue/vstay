import { apiFetch, ApiError } from "./api-client";
import { db } from "@/mock/db";
import type { LoginCredentials, LoginResult, User } from "@/types/auth";
import type { Workspace } from "@/types/workspace";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      return await apiFetch<LoginResult>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        throw err;
      }
      const cleanInput = credentials.email.trim().toLowerCase();
      const user = db.users.find(
        (u) => u.email.toLowerCase() === cleanInput || u.username?.toLowerCase() === cleanInput
      );
      if (user) {
        const wsId = user.workspaceIds[0];
        return {
          session: {
            token: `tok_${user.id}_${Math.floor(Date.now() / 1000)}`,
            userId: user.id,
            workspaceId: wsId,
            issuedAt: new Date().toISOString(),
          },
          user,
          requiresWorkspaceSelection: user.role === "owner" && user.workspaceIds.length > 1,
        };
      }
      throw err;
    }
  },

  async signup(data: {
    fullName: string;
    email: string;
    phone: string;
    hostelName: string;
    password?: string;
    planId?: "monthly" | "yearly" | null;
  }): Promise<LoginResult> {
    try {
      return await apiFetch<LoginResult>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      const ts = Date.now();
      const wsId = `pg_${data.hostelName.toLowerCase().replace(/\s+/g, "_")}_${String(ts).slice(-4)}`;
      const userId = `u_owner_${ts}`;
      const words = data.hostelName.trim().split(/\s+/);
      const initials = words.map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PG";

      const newUser: User = {
        id: userId,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: "owner",
        workspaceIds: [wsId],
        createdAt: new Date().toISOString(),
        password: data.password || "password",
      };

      const newWorkspace: Workspace = {
        id: wsId,
        name: data.hostelName,
        ownerId: userId,
        city: "Bengaluru",
        address: "12, MG Road, Bengaluru 560001",
        initials,
        totalBeds: 50,
        occupiedBeds: 0,
        accent: "blue",
        createdAt: new Date().toISOString(),
        ...(data.planId ? { planId: data.planId } : {}),
      };

      db.users.push(newUser);
      db.workspaces.push(newWorkspace);
      db.save();

      const session = {
        token: `tok_${userId}_${Math.floor(Date.now() / 1000)}`,
        userId,
        workspaceId: wsId,
        issuedAt: new Date().toISOString(),
      };

      return {
        session,
        user: newUser,
        requiresWorkspaceSelection: false,
      };
    }
  },

  async logout(): Promise<void> {
    // Stateless JWT – just clear client-side session
    return;
  },

  async me(userId: string): Promise<User> {
    try {
      return await apiFetch<User>(`/api/auth/me/${userId}`);
    } catch (err) {
      const u = db.users.find((x) => x.id === userId);
      if (u) return u;
      throw err;
    }
  },
};

export { ApiError };
