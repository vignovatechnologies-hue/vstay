import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Users, BedDouble, MessagesSquare, ClipboardList } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { STAFF_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/staff/dashboard")({
  head: () => ({ meta: [{ title: "Staff dashboard · Hostly" }] }),
  component: StaffDashboard,
});

function StaffDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title={`${ROLE_LABEL[user.role]} dashboard`}
      subtitle="Today's priorities for your shift"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Check-ins today" value="4" icon={Users} />
        <KpiCard
          label="Open complaints"
          value="3"
          delta="1 high priority"
          tone="down"
          icon={MessagesSquare}
        />
        <KpiCard label="Rooms to inspect" value="12" icon={BedDouble} />
        <KpiCard label="Tasks" value="7" delta="2 due today" tone="neutral" icon={ClipboardList} />
      </div>

      <Card className="mt-6 border-border/70">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Role-specific workflows (reception check-in flow, housekeeping board, maintenance queue,
            complaint triage) come online in later phases. The navigation, permissions, and shell
            adapt automatically based on the signed-in role.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
