import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Users, BedDouble, MessagesSquare } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { STAFF_NAV } from "@/config/navigation";
import { useApiCollection } from "@/hooks/use-api-collection";

export const Route = createFileRoute("/_authenticated/staff/dashboard")({
  head: () => ({ meta: [{ title: "Staff dashboard · Vstay" }] }),
  component: StaffDashboard,
});

function StaffDashboard() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();

  const { items: allTenants } = useApiCollection<{ id: string; name: string; room: string }>(
    "/api/tenants",
    {
      params: { workspaceId: activeWorkspace?.id },
      enabled: !!activeWorkspace?.id,
    }
  );

  const { items: allRooms } = useApiCollection<{ id: string; room: string; floor?: string; type?: string; status: string }>(
    "/api/rooms",
    {
      params: { workspaceId: activeWorkspace?.id },
      enabled: !!activeWorkspace?.id,
    }
  );

  const { items: allComplaints } = useApiCollection<{ id: string; status: string; priority: string; description: string }>(
    "/api/complaints",
    {
      params: { workspaceId: activeWorkspace?.id },
      enabled: !!activeWorkspace?.id,
    }
  );

  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  const occupiedRoomsCount = new Set(allTenants.map((t) => t.room)).size;
  const openComplaintsCount = allComplaints.filter((c) => c.status !== "resolved").length;

  return (
    <DashboardShell
      title={`${ROLE_LABEL[user.role]} dashboard`}
      subtitle="Today's live property overview"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Tenants" value={String(allTenants.length)} icon={Users} tone="up" />
        <KpiCard label="Occupied Rooms" value={String(occupiedRoomsCount)} icon={BedDouble} tone="up" />
        <KpiCard label="Total Rooms" value={String(allRooms.length)} icon={BedDouble} tone="neutral" />
        <KpiCard
          label="Open Complaints"
          value={String(openComplaintsCount)}
          tone={openComplaintsCount > 0 ? "down" : "up"}
          icon={MessagesSquare}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Property Tenants ({allTenants.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allTenants.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No tenants added by owner yet.</p>
            ) : (
              allTenants.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b border-border-default pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Assigned Room: {t.room}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" /> Property Rooms ({allRooms.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allRooms.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No rooms created by owner yet.</p>
            ) : (
              allRooms.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-border-default pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-semibold">Room {r.room}</p>
                    <p className="text-xs text-muted-foreground">{r.floor ? `${r.floor} Floor` : "Ground Floor"} · {r.type || "Standard"}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${r.status === 'vacant' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                    {r.status || 'Active'}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
