import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { SUPER_ADMIN_NAV, OWNER_NAV, STAFF_NAV, TENANT_NAV } from "@/config/navigation";
import { getDashboardRouteForRole, isStaffRole } from "@/config/roles";
import { toast } from "sonner";
import { PlanSelection } from "@/components/pricing/plan-selection";
import { apiFetch } from "@/services/api-client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/pricing")({
  head: () => ({ meta: [{ title: "Pricing · Hostly" }] }),
  component: PricingPage,
});

function PricingPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const isSuccess = params.get("success") === "true";
    const workspaceId = params.get("workspace_id");

    if (sessionId && isSuccess && workspaceId) {
      setVerifying(true);
      apiFetch(`/api/billing/verify-session?session_id=${sessionId}`)
        .then(() => {
          toast.success("Payment verified! Welcome to Hostly.");
          window.history.replaceState({}, document.title, window.location.pathname);
          // Force page reload to clear stale react-query workspace cache
          window.location.href = getDashboardRouteForRole(user.role);
        })
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Failed to verify payment session.");
          setVerifying(false);
        });
    } else if (params.get("success") === "false") {
      toast.error("Payment cancelled. Please select a plan to continue.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  if (!user) return null;

  const navGroups =
    user.role === "super_admin"
      ? SUPER_ADMIN_NAV
      : user.role === "owner"
        ? OWNER_NAV
        : isStaffRole(user.role)
          ? STAFF_NAV
          : user.role === "tenant"
            ? TENANT_NAV
            : [];

  const handleSelectPlan = async (planId: string) => {
    if (!activeWorkspace) {
      toast.error("No active workspace selected.");
      return;
    }
    setVerifying(true);
    try {
      const data = await apiFetch<{ url: string }>("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          planId,
          workspaceId: activeWorkspace.id,
        }),
      });
      // Redirect directly to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error initiating checkout");
      setVerifying(false);
    }
  };

  return (
    <DashboardShell
      title="Subscription Plan"
      subtitle="Select a plan to continue accessing your workspace features"
      navGroups={navGroups}
      showWorkspaceSwitcher={user.role === "owner"}
    >
      <div className="mt-4 relative">
        {verifying && (
          <div className="absolute inset-0 bg-background/80 z-50 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground font-medium">Processing payment checkout...</p>
          </div>
        )}
        <PlanSelection onSelectPlan={handleSelectPlan} />
      </div>
    </DashboardShell>
  );
}
