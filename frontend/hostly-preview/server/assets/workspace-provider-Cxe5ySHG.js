import { d as db, l as ApiError, n as useAuth, u as delay } from "./auth-provider-ucs5_vFo.js";
import { createContext, useCallback, useContext, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
//#region src/services/workspace.service.ts
var workspaceService = {
	async listForUser(userId) {
		const user = db.users.find((u) => u.id === userId);
		if (!user) throw new ApiError("User not found", 404, "NOT_FOUND");
		if (user.role === "super_admin") return delay([...db.workspaces]);
		return delay(db.workspaces.filter((w) => user.workspaceIds.includes(w.id)));
	},
	async get(workspaceId) {
		return delay(db.workspaces.find((w) => w.id === workspaceId) ?? null, 120);
	}
};
//#endregion
//#region src/providers/workspace-provider.tsx
var WorkspaceContext = createContext(null);
function WorkspaceProvider({ children }) {
	const { user, session, setActiveWorkspace } = useAuth();
	const queryClient = useQueryClient();
	const { data: workspaces = [], isLoading } = useQuery({
		queryKey: ["workspaces", user?.id ?? "anon"],
		queryFn: () => user ? workspaceService.listForUser(user.id) : Promise.resolve([]),
		enabled: Boolean(user),
		staleTime: 6e4
	});
	const activeWorkspace = useMemo(() => {
		if (!session?.workspaceId) return null;
		return workspaces.find((w) => w.id === session.workspaceId) ?? null;
	}, [workspaces, session?.workspaceId]);
	const switchWorkspace = useCallback((workspaceId) => {
		setActiveWorkspace(workspaceId);
		queryClient.invalidateQueries({ predicate: () => true });
	}, [setActiveWorkspace, queryClient]);
	const value = useMemo(() => ({
		workspaces,
		activeWorkspace,
		isLoading,
		switchWorkspace
	}), [
		workspaces,
		activeWorkspace,
		isLoading,
		switchWorkspace
	]);
	return /* @__PURE__ */ jsx(WorkspaceContext.Provider, {
		value,
		children
	});
}
function useWorkspace() {
	const ctx = useContext(WorkspaceContext);
	if (!ctx) throw new Error("useWorkspace must be used within <WorkspaceProvider>");
	return ctx;
}
//#endregion
export { useWorkspace as n, WorkspaceProvider as t };
