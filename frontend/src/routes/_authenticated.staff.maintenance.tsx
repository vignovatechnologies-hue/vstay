import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { STAFF_NAV } from "@/config/navigation";
import { isStaffRole } from "@/config/roles";

export const Route = createFileRoute("/_authenticated/staff/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance · Vstay" }] }),
  component: StaffMaintenancePage,
});

function StaffMaintenancePage() {
  const { user } = useAuth();

  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title="Maintenance"
      subtitle="Manage property maintenance tasks"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 mt-6">
        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-muted-foreground" />
              Maintenance Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              The maintenance queue and task assignment workflows will be available in a later phase. 
              For now, please refer to the Complaints section for any maintenance requests raised by tenants.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
