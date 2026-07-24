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
  head: () => ({ meta: [{ title: "Revenue · Vstay" }] }),
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

const STATUS: Record<string, { label: string; variant: "success" | "danger" | "info" }> = {
  paid: { label: "Paid", variant: "success" },
  past_due: { label: "Past due", variant: "danger" },
  trial: { label: "Trial", variant: "info" },
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

      <Card className="mt-6 border-border-default">
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

      <section className="w-full mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">Recent invoices</h2>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="mr-1 h-3.5 w-3.5" /> Export
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
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
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#CBD5E1] font-medium">{i.id}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{i.owner}</TableCell>
                  <TableCell>
                    <Badge variant="category">{i.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC] tabular-nums">{i.amount}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{i.date}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS[i.status].variant}>
                      {STATUS[i.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
      </section>
    </DashboardShell>
  );
}
