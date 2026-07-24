import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { CreditCard, Download, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import { useLocalState } from "@/lib/local-store";
import { useApiCollection } from "@/hooks/use-api-collection";
import { downloadText, formatShortDate } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/tenant/payments")({
  head: () => ({ meta: [{ title: "Rent & receipts · Vstay" }] }),
  component: PaymentsPage,
});

type Receipt = {
  id: string;
  month: string;
  amount: string;
  date: string;
  method: string;
  status: "paid" | "due";
};

const SEED: Receipt[] = [
  {
    id: "RCP-2611",
    month: "November 2026",
    amount: "₹ 11,500",
    date: "05 Nov 2026",
    method: "UPI · HDFC",
    status: "paid",
  },
  {
    id: "RCP-2610",
    month: "October 2026",
    amount: "₹ 11,500",
    date: "04 Oct 2026",
    method: "UPI · HDFC",
    status: "paid",
  },
  {
    id: "RCP-2609",
    month: "September 2026",
    amount: "₹ 11,500",
    date: "06 Sep 2026",
    method: "Card · Visa 4021",
    status: "paid",
  },
  {
    id: "RCP-2608",
    month: "August 2026",
    amount: "₹ 11,500",
    date: "05 Aug 2026",
    method: "UPI · HDFC",
    status: "paid",
  },
  {
    id: "RCP-2607",
    month: "July 2026",
    amount: "₹ 11,500",
    date: "07 Jul 2026",
    method: "Cash",
    status: "paid",
  },
];

function PaymentsPage() {
  const { user } = useAuth();
  const { items, update } = useApiCollection<Receipt>("/api/invoices", {
    params: { tenantName: user?.fullName },
    enabled: !!user?.fullName,
  });
  const [autopay, setAutopay] = useLocalState("vstay.tenant.autopay", false);
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  const receipts = useMemo(() => items.filter((r) => r.status === "paid"), [items]);
  const dueInvoice = useMemo(() => items.find((r) => r.status === "due"), [items]);

  const dueAmount = dueInvoice ? parseInt(dueInvoice.amount.replace(/[^\d]/g, "")) || 11500 : 0;
  const isPaid = !dueInvoice;

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  function receiptText(r: Receipt) {
    return `VSTAY · RENT RECEIPT
-------------------------
Receipt ID : ${r.id}
Tenant     : ${user!.fullName}
For        : ${r.month}
Amount     : ${r.amount}
Paid on    : ${r.date}
Method     : ${r.method}
Status     : PAID

Thank you for staying with Greenhaven Residency.`;
  }

  function download(r: Receipt) {
    downloadText(`${r.id}.txt`, receiptText(r));
    toast.success(`Receipt ${r.id} downloaded`);
  }

  async function pay() {
    if (!dueInvoice) return;
    setProcessing(true);
    const paidMethod = method === "upi" ? "UPI · HDFC" : method === "card" ? "Card · Visa 4021" : "Bank";
    try {
      await update(dueInvoice.id, {
        status: "paid",
        date: formatShortDate(),
        method: paidMethod,
      });
      setPayOpen(false);
      toast.success(`Paid ${dueInvoice.amount} — receipt saved`);
    } catch {
      toast.error("Failed to make payment");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <DashboardShell
      title="Rent & receipts"
      subtitle="Manage payments and download receipts"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border-default bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {isPaid ? "Rent paid" : "Next payment due"}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                ₹ {dueAmount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />{" "}
                {isPaid ? "Next cycle starts 1 Jan 2027" : `Due on 5 December 2026`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button disabled={isPaid} onClick={() => setPayOpen(true)}>
                <CreditCard className="mr-1 h-4 w-4" /> {isPaid ? "Paid" : "Pay now"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAutopay(!autopay);
                  toast.success(autopay ? "Auto-pay disabled" : "Auto-pay enabled");
                }}
              >
                {autopay ? "Disable auto-pay" : "Set up auto-pay"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border-default">
          <CardContent className="space-y-2 p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Deposit
            </p>
            <p className="text-2xl font-semibold">₹ 23,000</p>
            <p className="text-xs text-muted-foreground">
              Refundable on move-out. Held since May 2025.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="w-full mt-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">Payment history</h2>
        </div>
        <div className="w-full">
          {/* LIGHT MODE: Spreadsheet Table */}
          <div className="block dark:hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Paid on</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#CBD5E1] font-medium">{r.id}</TableCell>
                    <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{r.month}</TableCell>
                    <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{r.date}</TableCell>
                    <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{r.method}</TableCell>
                    <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC] tabular-nums">{r.amount}</TableCell>
                    <TableCell>
                      <Badge variant="success">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="tableActionIcon" size="tableIcon" onClick={() => download(r)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* DARK MODE: Professional Transaction Records */}
          <div className="hidden dark:flex flex-col gap-2 mt-2">
            {receipts.map((r) => (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-[14px_16px] rounded-[10px] bg-[rgba(17,30,49,0.68)] border border-[rgba(100,116,139,0.14)] hover:bg-[rgba(37,99,235,0.08)] transition-colors duration-150">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="font-semibold text-[#F1F5F9]">{r.month}</span>
                  <div className="flex items-center gap-2 text-[#8492A6] text-xs">
                    <span>Paid on: {r.date}</span>
                    <span>•</span>
                    <span>{r.method}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline font-mono">{r.id}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                  <span className="font-semibold text-[#F1F5F9] text-base tabular-nums">{r.amount}</span>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
                    </Badge>
                    <Button variant="outline" size="sm" className="h-8 border-[rgba(100,116,139,0.14)] text-[#B6C2D2] hover:text-[#F1F5F9] hover:bg-[#142238]" onClick={() => download(r)}>
                      <Download className="mr-1.5 h-3.5 w-3.5" /> Receipt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay rent — ₹ {dueAmount.toLocaleString("en-IN")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Payment method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI · HDFC</SelectItem>
                  <SelectItem value="card">Card · Visa 4021</SelectItem>
                  <SelectItem value="bank">Net banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {method === "upi" && <Input placeholder="you@upi" defaultValue="arjun@hdfc" />}
            {method === "card" && (
              <Input placeholder="•••• •••• •••• 4021" defaultValue="4021 •••• •••• 4021" />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={pay} disabled={processing}>
              {processing ? "Processing…" : "Confirm payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
