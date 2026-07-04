import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { CreditCard, BedDouble, MessagesSquare, FileText } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/tenant/dashboard")({
  head: () => ({ meta: [{ title: "My stay · Hostly" }] }),
  component: TenantDashboard,
});

function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title={`Hello, ${user.fullName.split(" ")[0]}`}
      subtitle="Your stay at Greenhaven Residency, Room 204"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Next rent due"
          value="Dec 5"
          delta="₹ 11,500"
          icon={CreditCard}
          tone="neutral"
        />
        <KpiCard label="Room" value="204 · Bed B" icon={BedDouble} />
        <KpiCard
          label="Open requests"
          value="1"
          delta="In progress"
          icon={MessagesSquare}
          tone="neutral"
        />
        <KpiCard label="Documents" value="3" delta="All verified" icon={FileText} tone="up" />
      </div>

      <Card className="mt-6 border-border/70">
        <CardContent className="space-y-3 p-6">
          <h2 className="text-base font-semibold tracking-tight">Coming up</h2>
          <p className="text-sm text-muted-foreground">
            Rent payment with UPI/cards, deposit & receipt history, complaint filing with photo
            uploads, food/laundry preferences and digital agreements come online in the tenant
            phase.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={() => navigate({ to: "/tenant/payments" })}>
              Pay rent
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: "/tenant/complaints" })}
            >
              Raise complaint
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
