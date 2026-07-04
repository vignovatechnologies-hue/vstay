import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { useLocalCollection, useLocalState } from "@/lib/local-store";
import { downloadText, shortId, formatShortDate } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/tenant/payments")({
  head: () => ({ meta: [{ title: "Rent & receipts · Hostly" }] }),
  component: PaymentsPage,
});

type Receipt = {
  id: string;
  month: string;
  amount: string;
  date: string;
  method: string;
  status: "paid";
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
  const { items, add } = useLocalCollection<Receipt>("hostly.tenant.receipts", SEED);
  const [autopay, setAutopay] = useLocalState("hostly.tenant.autopay", false);
  const [payOpen, setPayOpen] = useState(false);
  const [nextDue, setNextDue] = useLocalState("hostly.tenant.nextDue", {
    amount: 11500,
    dueOn: "5 December 2026",
    paid: false,
  });
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  function receiptText(r: Receipt) {
    return `HOSTLY · RENT RECEIPT
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

  function pay() {
    setProcessing(true);
    setTimeout(() => {
      const r: Receipt = {
        id: shortId("RCP"),
        month: nextDue.dueOn.split(" ").slice(1).join(" "),
        amount: `₹ ${nextDue.amount.toLocaleString("en-IN")}`,
        date: formatShortDate(),
        method: method === "upi" ? "UPI · HDFC" : method === "card" ? "Card · Visa 4021" : "Bank",
        status: "paid",
      };
      add(r);
      setNextDue({ ...nextDue, paid: true });
      setProcessing(false);
      setPayOpen(false);
      toast.success(`Paid ${r.amount} — receipt saved`);
    }, 900);
  }

  return (
    <DashboardShell
      title="Rent & receipts"
      subtitle="Manage payments and download receipts"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {nextDue.paid ? "Rent paid" : "Next payment due"}
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">
                ₹ {nextDue.amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />{" "}
                {nextDue.paid ? "Next cycle starts 1 Jan 2027" : `Due on ${nextDue.dueOn}`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button disabled={nextDue.paid} onClick={() => setPayOpen(true)}>
                <CreditCard className="mr-1 h-4 w-4" /> {nextDue.paid ? "Paid" : "Pay now"}
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
        <Card className="border-border/70">
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

      <Card className="mt-6 border-border/70">
        <CardHeader>
          <CardTitle className="text-base">Payment history</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.month}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="text-muted-foreground">{r.method}</TableCell>
                  <TableCell className="font-semibold">{r.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => download(r)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay rent — ₹ {nextDue.amount.toLocaleString("en-IN")}</DialogTitle>
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
