import { apiFetch } from "./api-client";
import type { Workspace } from "@/types/workspace";

export const workspaceService = {
  async listForUser(userId: string): Promise<Workspace[]> {
    return apiFetch<Workspace[]>(`/api/workspaces?userId=${encodeURIComponent(userId)}`);
  },
  async get(workspaceId: string): Promise<Workspace | null> {
    return apiFetch<Workspace | null>(`/api/workspaces/${encodeURIComponent(workspaceId)}`);
  },
};
