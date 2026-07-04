import { db } from "@/mock/db";
import { delay, ApiError } from "./http";
import type { Workspace } from "@/types/workspace";

export const workspaceService = {
  async listForUser(userId: string): Promise<Workspace[]> {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");
    if (user.role === "super_admin") return delay([...db.workspaces]);
    return delay(db.workspaces.filter((w) => user.workspaceIds.includes(w.id)));
  },
  async get(workspaceId: string): Promise<Workspace | null> {
    return delay(db.workspaces.find((w) => w.id === workspaceId) ?? null, 120);
  },
};
