import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { BedDouble, Users, CreditCard, AlertCircle, Building2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/owner/dashboard")({
  head: () => ({ meta: [{ title: "Owner dashboard · Hostly" }] }),
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const { user } = useAuth();
  const { activeWorkspace, workspaces } = useWorkspace();
  const navigate = useNavigate();
  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  if (user.workspaceIds.length > 1 && !activeWorkspace) {
    return <Navigate to="/workspace-select" />;
  }

  const w = activeWorkspace ?? workspaces[0] ?? null;
  const occupancy = w ? Math.round((w.occupiedBeds / w.totalBeds) * 100) : 0;

  return (
    <DashboardShell
      title={w?.name ?? "Owner dashboard"}
      subtitle={w?.address}
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      {!w ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <h2 className="text-base font-semibold">No property selected</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Pick a workspace from the top bar to see its dashboard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Occupancy"
              value={`${occupancy}%`}
              delta={`${w.occupiedBeds} of ${w.totalBeds} beds`}
              icon={BedDouble}
              tone="up"
            />
            <KpiCard
              label="Active tenants"
              value={w.occupiedBeds.toString()}
              delta="+4 this month"
              tone="up"
              icon={Users}
            />
            <KpiCard
              label="Collections (Nov)"
              value="₹ 4.62L"
              delta="92% collected"
              tone="up"
              icon={CreditCard}
            />
            <KpiCard
              label="Open complaints"
              value="3"
              delta="2 awaiting action"
              tone="neutral"
              icon={AlertCircle}
            />
          </div>

          <Card className="mt-6 border-border/70">
            <CardContent className="space-y-3 p-6">
              <h2 className="text-base font-semibold tracking-tight">Phase 1 scaffold</h2>
              <p className="text-sm text-muted-foreground">
                You&apos;re looking at the wired-up shell: role-aware routing, multi-workspace
                switcher (try it from the top bar), persisted session, theme-tokenised design
                system, and the mock service layer. Modules — properties, rooms, tenants, payments,
                staff, complaints — drop into the next phases.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" onClick={() => navigate({ to: "/owner/properties" })}>
                  Add property
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/owner/staff" })}
                >
                  Invite staff
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate({ to: "/owner/reports" })}
                >
                  View reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardShell>
  );
}
