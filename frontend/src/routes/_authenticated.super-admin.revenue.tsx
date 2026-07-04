import { createFileRoute, Navigate } from "@tanstack/react-router";
import { CreditCard, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/actions";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/super-admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue · Hostly" }] }),
  component: RevenuePage,
});

const MONTHS = [
  { m: "Jun", v: 62 },
  { m: "Jul", v: 68 },
  { m: "Aug", v: 71 },
  { m: "Sep", v: 74 },
  { m: "Oct", v: 78 },
  { m: "Nov", v: 84 },
];

const INVOICES = [
  {
    id: "INV-11284",
    owner: "Rajesh Malhotra",
    plan: "Scale",
    amount: "₹ 12,996",
    date: "01 Dec 2026",
    status: "paid" as const,
  },
  {
    id: "INV-11283",
    owner: "Arvind Rao",
    plan: "Scale",
    amount: "₹ 12,996",
    date: "01 Dec 2026",
    status: "paid" as const,
  },
  {
    id: "INV-11282",
    owner: "Meera Krishnan",
    plan: "Growth",
    amount: "₹ 2,499",
    date: "01 Dec 2026",
    status: "paid" as const,
  },
  {
    id: "INV-11281",
    owner: "Prakash Iyer",
    plan: "Starter",
    amount: "₹ 999",
    date: "01 Dec 2026",
    status: "past_due" as const,
  },
  {
    id: "INV-11280",
    owner: "Nikhil Agarwal",
    plan: "Growth",
    amount: "₹ 2,499",
    date: "01 Dec 2026",
    status: "paid" as const,
  },
  {
    id: "INV-11279",
    owner: "Kavya Reddy",
    plan: "Growth",
    amount: "₹ 0",
    date: "01 Dec 2026",
    status: "trial" as const,
  },
];

const STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  past_due: { label: "Past due", className: "bg-destructive/10 text-destructive" },
  trial: { label: "Trial", className: "bg-info/10 text-info" },
};

function RevenuePage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  const max = Math.max(...MONTHS.map((m) => m.v));
  const exportCsv = () => {
    downloadCSV("platform-invoices.csv", INVOICES);
    toast.success("Invoices exported");
  };

  return (
    <DashboardShell
      title="Revenue"
      subtitle="Subscription and platform earnings"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="MRR" value="₹ 8.4L" delta="+12.4%" tone="up" icon={CreditCard} />
        <KpiCard label="ARR" value="₹ 1.01Cr" delta="+18.6%" tone="up" icon={TrendingUp} />
        <KpiCard label="ARPA" value="₹ 8,936" delta="+₹ 412" tone="up" icon={CreditCard} />
        <KpiCard label="Churn (30d)" value="1.8%" delta="−0.4%" tone="up" icon={CreditCard} />
      </div>

      <Card className="mt-6 border-border/70">
        <CardHeader>
          <CardTitle className="text-base">MRR trend · last 6 months</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-52 items-end gap-6">
            {MONTHS.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t bg-primary/80"
                    style={{ height: `${(m.v / max) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">{m.m}</div>
                <div className="text-xs font-medium tabular-nums">₹ {m.v}k</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-border/70">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/70 p-4">
            <p className="text-sm font-medium">Recent invoices</p>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="mr-1 h-3.5 w-3.5" /> Export
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell>{i.owner}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{i.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{i.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{i.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS[i.status].className}>
                      {STATUS[i.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
