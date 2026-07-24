import { createFileRoute, Navigate } from "@tanstack/react-router";
import { BarChart3, Download, TrendingUp, Users, Building2 } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/super-admin/reports")({
  head: () => ({ meta: [{ title: "Reports · Vstay" }] }),
  component: ReportsPage,
});

const SIGNUPS = [
  { m: "Jun", v: 6 },
  { m: "Jul", v: 9 },
  { m: "Aug", v: 11 },
  { m: "Sep", v: 8 },
  { m: "Oct", v: 14 },
  { m: "Nov", v: 18 },
];

const CITIES = [
  { city: "Bengaluru", owners: 28, share: 30 },
  { city: "Mumbai", owners: 22, share: 23 },
  { city: "Hyderabad", owners: 14, share: 15 },
  { city: "Pune", owners: 10, share: 11 },
  { city: "Chennai", owners: 8, share: 9 },
  { city: "Others", owners: 12, share: 12 },
];

function ReportsPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;
  const max = Math.max(...SIGNUPS.map((s) => s.v));
  const exportCsv = () => {
    downloadCSV("platform-report.csv", [...SIGNUPS, ...CITIES]);
    toast.success("Report exported");
  };

  return (
    <DashboardShell
      title="Reports"
      subtitle="Platform-wide analytics and insights"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-1 h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="New owners (30d)" value="18" delta="+38%" tone="up" icon={Users} />
        <KpiCard label="Bed additions" value="+184" tone="up" icon={Building2} />
        <KpiCard label="Platform GMV" value="₹ 3.42Cr" delta="+14.2%" tone="up" icon={TrendingUp} />
        <KpiCard label="Support tickets" value="42" delta="−8 vs prev" tone="up" icon={BarChart3} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="text-base">Owner sign-ups · last 6 months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-6">
              {SIGNUPS.map((s) => (
                <div key={s.m} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t bg-info/80"
                      style={{ height: `${(s.v / max) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{s.m}</div>
                  <div className="text-xs font-medium tabular-nums">{s.v}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="text-base">Owners by city</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {CITIES.map((c) => (
              <div key={c.city}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium">{c.city}</span>
                  <span className="text-muted-foreground">
                    {c.owners} owners · {c.share}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.share * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
