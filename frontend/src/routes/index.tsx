import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import { getDashboardRouteForRole } from "@/config/roles";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Vstay" }],
  }),
  component: Index,
});

function Index() {
  const { status, user, session } = useAuth();

  // While auth state is loading, show a spinner
  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Already logged in → send to their dashboard
  if (status === "authenticated" && user) {
    if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) {
      return <Navigate to="/workspace-select" />;
    }
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }

  // Not logged in → go straight to login (no landing page)
  return <Navigate to="/login" />;
}
