import { createFileRoute, Navigate } from "@tanstack/react-router";
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { OWNER_NAV } from "@/config/navigation";
import { KpiCard } from "@/components/layout/kpi-card";
import { downloadCSV } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/owner/reports")({
  head: () => ({ meta: [{ title: "Reports · Hostly" }] }),
  component: ReportsPage,
});

const MONTHS = [
  { m: "Jun", collected: 3.8, target: 4.5 },
  { m: "Jul", collected: 4.1, target: 4.5 },
  { m: "Aug", collected: 4.3, target: 4.6 },
  { m: "Sep", collected: 4.4, target: 4.7 },
  { m: "Oct", collected: 4.5, target: 4.8 },
  { m: "Nov", collected: 4.62, target: 5.0 },
];
const MAX = 5;

function ReportsPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function exportReport() {
    downloadCSV("owner-report-2026.csv", MONTHS);
    toast.success("Report exported");
  }

  return (
    <DashboardShell
      title="Reports"
      subtitle="Financial and occupancy insights"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={exportReport}>
          <Download className="mr-1 h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue YTD" value="₹ 48.2L" delta="+12% YoY" tone="up" icon={TrendingUp} />
        <KpiCard label="Avg. occupancy" value="89%" delta="+3 pts" tone="up" icon={BarChart3} />
        <KpiCard label="Avg. tenure" value="9.4 mo" delta="+0.6" tone="up" icon={TrendingUp} />
        <KpiCard label="Churn" value="4.1%" delta="-0.8 pts" tone="up" icon={TrendingDown} />
      </div>

      <Card className="mt-6 border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Collections vs target (₹ Lakh)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-end justify-between gap-3">
            {MONTHS.map((row) => (
              <div key={row.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="w-1/2 rounded-t bg-primary"
                    style={{ height: `${(row.collected / MAX) * 100}%` }}
                    title={`Collected ₹${row.collected}L`}
                  />
                  <div
                    className="w-1/2 rounded-t bg-muted"
                    style={{ height: `${(row.target / MAX) * 100}%` }}
                    title={`Target ₹${row.target}L`}
                  />
                </div>
                <p className="text-xs font-medium">{row.m}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-primary" /> Collected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-muted" /> Target
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Top revenue rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { r: "Room 101 · Single AC", v: "₹ 16,500" },
              { r: "Room 205 · Single", v: "₹ 14,000" },
              { r: "Room 102 · Double AC", v: "₹ 24,000" },
            ].map((x) => (
              <div
                key={x.r}
                className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
              >
                <span className="text-sm">{x.r}</span>
                <span className="font-semibold">{x.v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Expense split (Nov)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { l: "Housekeeping", v: 32 },
              { l: "Utilities", v: 26 },
              { l: "Maintenance", v: 18 },
              { l: "Food", v: 24 },
            ].map((x) => (
              <div key={x.l}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{x.l}</span>
                  <span className="font-medium">{x.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${x.v}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
