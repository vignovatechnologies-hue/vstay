import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CreditCard, Download, Filter, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { downloadCSV } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/owner/payments")({
  head: () => ({ meta: [{ title: "Rent & Payments · Hostly" }] }),
  component: PaymentsPage,
});

type PayStatus = "paid" | "due" | "overdue";
type Invoice = {
  id: string;
  tenant: string;
  room: string;
  month: string;
  amount: string;
  date: string;
  method: string;
  status: PayStatus;
};

const SEED: Invoice[] = [
  {
    id: "INV-1104",
    tenant: "Arjun Kapoor",
    room: "204·B",
    month: "Nov 2026",
    amount: "₹ 11,500",
    date: "05 Nov",
    method: "UPI",
    status: "paid",
  },
  {
    id: "INV-1105",
    tenant: "Vikram Singh",
    room: "204·A",
    month: "Nov 2026",
    amount: "₹ 11,500",
    date: "03 Nov",
    method: "UPI",
    status: "paid",
  },
  {
    id: "INV-1106",
    tenant: "Nikhil Rao",
    room: "204·C",
    month: "Nov 2026",
    amount: "₹ 11,500",
    date: "—",
    method: "—",
    status: "due",
  },
  {
    id: "INV-1107",
    tenant: "Priya Sharma",
    room: "201·A",
    month: "Nov 2026",
    amount: "₹ 9,500",
    date: "06 Nov",
    method: "Bank",
    status: "paid",
  },
  {
    id: "INV-1108",
    tenant: "Rahul Menon",
    room: "101",
    month: "Nov 2026",
    amount: "₹ 16,500",
    date: "—",
    method: "—",
    status: "overdue",
  },
  {
    id: "INV-1109",
    tenant: "Sneha Iyer",
    room: "301·A",
    month: "Nov 2026",
    amount: "₹ 10,500",
    date: "04 Nov",
    method: "Card",
    status: "paid",
  },
];
const STATUS: Record<PayStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
};

function PaymentsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, update } = useApiCollection<Invoice>("/api/invoices", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const [filter, setFilter] = useState<"all" | PayStatus>("all");
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function remind(inv: Invoice) {
    toast.success(`Reminder sent to ${inv.tenant}`);
  }
  async function markPaid(inv: Invoice) {
    try {
      await update(inv.id, {
        status: "paid",
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        method: "Manual",
      });
      toast.success(`${inv.id} marked as paid`);
    } catch {
      toast.error("Failed to mark invoice as paid");
    }
  }
  function exportCsv() {
    downloadCSV("invoices-november-2026.csv", filtered);
    toast.success("Invoices exported");
  }

  return (
    <DashboardShell
      title="Rent & Payments"
      subtitle="Collections, dues and payment history"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Collected (Nov)" value="₹ 4.62L" delta="92%" tone="up" icon={Wallet} />
        <KpiCard
          label="Pending"
          value="₹ 38,000"
          delta="3 invoices"
          tone="neutral"
          icon={CreditCard}
        />
        <KpiCard label="Overdue" value="₹ 16,500" delta="1 tenant" tone="down" icon={AlertCircle} />
        <KpiCard label="MoM growth" value="+8.4%" tone="up" icon={TrendingUp} />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">Invoices · November 2026</h2>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as "all" | PayStatus)}>
              <SelectTrigger className="h-8 w-[130px]">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="mr-1 h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid on</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#CBD5E1] font-medium">{p.id}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{p.tenant}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#718096]">
                    {p.room}
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{p.month}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC] tabular-nums">{p.amount}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{p.date}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{p.method}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS[p.status]} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {p.status !== "paid" && (
                      <Button variant="tableActionPrimary" size="sm" onClick={() => markPaid(p)}>
                        Mark paid
                      </Button>
                    )}
                    {p.status !== "paid" && (
                      <Button variant="tableAction" size="sm" onClick={() => remind(p)}>
                        Remind
                      </Button>
                    )}
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
