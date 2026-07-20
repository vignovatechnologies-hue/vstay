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
import { usePlansConfig } from "@/lib/plans-config";

export const Route = createFileRoute("/_authenticated/pricing")({
  head: () => ({ meta: [{ title: "Pricing · Hostly" }] }),
  component: PricingPage,
});

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PricingPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [verifying, setVerifying] = useState(false);
  const [{ plans }] = usePlansConfig();

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
      // Lookup dynamic price and name from super admin config (price in ₹ → paise = × 100)
      const plan = plans.find((p) => p.id === planId);
      if (!plan) {
        toast.error("Selected plan details not found in configuration.");
        setVerifying(false);
        return;
      }
      const amountPaise = Math.round(plan.price * 100);
      const planName = plan.name || planId;

      // 1. Create order on the backend with dynamic amount and name
      const order = await apiFetch<{
        keyId: string;
        orderId: string;
        amount: number;
        currency: string;
        planId: string;
        workspaceId: string;
      }>("/api/billing/create-razorpay-order", {
        method: "POST",
        body: JSON.stringify({
          planId,
          planName,
          workspaceId: activeWorkspace.id,
          amountPaise,
        }),
      });

      // 2. Load the script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setVerifying(false);
        return;
      }

      // 3. Open Razorpay checkout modal
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Hostly",
        description: order.planId === "monthly" ? "Hostly Monthly Plan" : "Hostly Yearly Plan",
        order_id: order.orderId,
        prefill: {
          name: user.fullName || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#0f172a", // Match theme navy primary color
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setVerifying(true);
          try {
            const verification = await apiFetch<{ status: string }>("/api/billing/verify-razorpay-payment", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                workspaceId: order.workspaceId,
                planId: order.planId,
                amountPaid: Math.round(order.amount / 100),
              }),
            });

            if (verification.status === "success") {
              toast.success("Payment verified! Welcome to Hostly.");
              // Force page reload to clear stale react-query workspace cache
              window.location.href = getDashboardRouteForRole(user.role);
            } else {
              toast.error("Signature verification failed.");
              setVerifying(false);
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error verifying payment signature");
            setVerifying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setVerifying(false);
            toast.info("Payment checkout closed.");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error initiating Razorpay checkout");
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
