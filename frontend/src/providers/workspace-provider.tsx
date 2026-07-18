import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { workspaceService } from "@/services/workspace.service";
import { useAuth } from "@/providers/auth-provider";
import type { Workspace } from "@/types/workspace";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, session, setActiveWorkspace } = useAuth();
  const queryClient = useQueryClient();

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["workspaces", user?.id ?? "anon"],
    queryFn: () => (user ? workspaceService.listForUser(user.id) : Promise.resolve([])),
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  const activeWorkspace = useMemo(() => {
    if (!session?.workspaceId) return null;
    return workspaces.find((w) => w.id === session.workspaceId) ?? null;
  }, [workspaces, session?.workspaceId]);

  const switchWorkspace = useCallback(
    (workspaceId: string) => {
      setActiveWorkspace(workspaceId);
      queryClient.invalidateQueries({ predicate: () => true });
    },
    [setActiveWorkspace, queryClient],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({ workspaces, activeWorkspace, isLoading, switchWorkspace }),
    [workspaces, activeWorkspace, isLoading, switchWorkspace],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within <WorkspaceProvider>");
  return ctx;
}
