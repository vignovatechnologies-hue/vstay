import { createFileRoute, Outlet, redirect, Navigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { sessionStorage } from "@/lib/session-storage";
import { useAuth } from "@/providers/auth-provider";
import { getDashboardRouteForRole, isStaffRole } from "@/config/roles";

import { useWorkspace } from "@/providers/workspace-provider";

/**
 * Pathless layout that gates every authenticated page. Runs client-side
 * only (ssr:false) so we can read the mock session from localStorage.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    const session = sessionStorage.read();
    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { status, user } = useAuth();
  const { activeWorkspace, isLoading: wsLoading } = useWorkspace();
  const location = useLocation();

  useEffect(() => {
    // Scope the dark navy theme strictly to the authenticated app
    const root = document.documentElement;
    root.classList.add("theme-navy");
    return () => {
      root.classList.remove("theme-navy");
      // Note: we leave 'dark' alone because ThemeProvider manages it globally.
    };
  }, []);

  const isPricingPage = location.pathname === "/pricing";

  // Wait for user or workspace details to load
  if (status === "loading" || (user?.role === "owner" && wsLoading)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" search={{ redirect: location.href }} />;
  }

  // Gate check: If user is an owner, they must have an active subscription to access features
  if (user.role === "owner" && !isPricingPage) {
    if (activeWorkspace && activeWorkspace.subscriptionStatus !== "active") {
      return <Navigate to="/pricing" />;
    }
  }

  const path = location.pathname;

  if (path.startsWith("/owner") && user.role !== "owner") {
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }
  if (path.startsWith("/super-admin") && user.role !== "super_admin") {
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }
  if (path.startsWith("/tenant") && user.role !== "tenant") {
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }
  if (path.startsWith("/staff") && !isStaffRole(user.role)) {
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }

  return <Outlet />;
}
