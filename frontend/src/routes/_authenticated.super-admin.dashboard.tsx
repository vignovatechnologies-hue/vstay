import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Users, Building2, CreditCard, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/super-admin/dashboard")({
  head: () => ({ meta: [{ title: "Platform overview · Hostly" }] }),
  component: SuperAdminDashboard,
});

function SuperAdminDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title="Platform overview"
      subtitle="Health of every Hostly workspace at a glance"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active workspaces"
          value="128"
          delta="+6 this month"
          tone="up"
          icon={Building2}
        />
        <KpiCard label="Total owners" value="94" delta="+3 this week" tone="up" icon={Users} />
        <KpiCard label="MRR" value="₹ 8.4L" delta="+12.4%" tone="up" icon={CreditCard} />
        <KpiCard
          label="Open incidents"
          value="2"
          delta="−3 vs last week"
          tone="up"
          icon={ShieldCheck}
        />
      </div>

      <Card className="mt-6 border-border/70">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Detailed platform analytics, audit log explorer, owner management and subscription tools
            land in a later phase. The shell, design system, role-aware routing, and workspace
            switcher are wired up so feature pages can drop in without touching infrastructure.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
