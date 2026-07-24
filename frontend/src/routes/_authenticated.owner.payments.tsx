import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CreditCard, Download, Filter, TrendingUp, Wallet, AlertCircle, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  head: () => ({ meta: [{ title: "Rent & Payments · Vstay" }] }),
  component: PaymentsPage,
});

type PayStatus = "paid" | "due" | "overdue";
type Invoice = {
  id: string;
  workspace_id?: string;
  tenant: string;
  room: string;
  month: string;
  amount: string;
  date: string;
  method: string;
  status: PayStatus;
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const YEAR_OPTIONS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

const STATUS: Record<PayStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
};

function PaymentsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, add, update } = useApiCollection<Invoice>("/api/invoices", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });

  const { items: allTenants } = useApiCollection<{ id: string; name: string; room?: string }>(
    "/api/tenants",
    { params: { workspaceId: activeWorkspace?.id }, enabled: !!activeWorkspace?.id }
  );

  const { items: allRooms } = useApiCollection<{ id: string; room: string; beds?: string; rent?: string }>(
    "/api/rooms",
    { params: { workspaceId: activeWorkspace?.id }, enabled: !!activeWorkspace?.id }
  );

  const roomOptions = useMemo(() => {
    const map = new Map<string, { room: string; beds?: string; rent?: string }>();
    allRooms.forEach((r) => {
      if (r.room) map.set(r.room, { room: r.room, beds: r.beds, rent: r.rent });
    });
    allTenants.forEach((t) => {
      if (t.room && !map.has(t.room)) {
        map.set(t.room, { room: t.room });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.room.localeCompare(b.room, undefined, { numeric: true })
    );
  }, [allRooms, allTenants]);

  const [filter, setFilter] = useState<"all" | PayStatus>("all");
  const [open, setOpen] = useState(false);
  const [selectedMonthName, setSelectedMonthName] = useState<string>("Nov");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [payDate, setPayDate] = useState<Date | undefined>(new Date(2026, 10, 1));
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 10, 1));

  const handleMonthYearChange = (mName: string, yr: number) => {
    setSelectedMonthName(mName);
    setSelectedYear(yr);
    const monthIdx = MONTH_NAMES.indexOf(mName);
    setForm((prev) => ({ ...prev, month: `${mName} ${yr}` }));

    const newDate = new Date(yr, monthIdx >= 0 ? monthIdx : 0, 1);
    setCalendarMonth(newDate);
    setPayDate(newDate);
  };

  const [form, setForm] = useState({
    tenant: "",
    room: "",
    month: "Nov 2026",
    amount: "₹ 11,500",
    date: format(new Date(2026, 10, 1), "dd MMM"),
    method: "UPI",
    status: "paid" as PayStatus,
  });

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

  async function submitAdd() {
    if (!form.tenant.trim() || !form.room.trim()) {
      toast.error("Tenant name and room are required");
      return;
    }
    try {
      const formattedDate = payDate
        ? format(payDate, "dd MMM")
        : form.date.trim() ||
          (form.status === "paid"
            ? new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
            : "—");

      await add({
        workspace_id: activeWorkspace?.id ?? "",
        tenant: form.tenant.trim(),
        room: form.room.trim(),
        month: form.month.trim() || "Nov 2026",
        amount: form.amount.trim().startsWith("₹") ? form.amount.trim() : `₹ ${form.amount.trim()}`,
        date: form.status === "paid" ? formattedDate : "—",
        method: form.status === "paid" ? (form.method || "UPI") : "—",
        status: form.status,
      });
      toast.success(`Payment record created for ${form.tenant}`);
      setPayDate(new Date());
      setForm({
        tenant: "",
        room: "",
        month: "Nov 2026",
        amount: "₹ 11,500",
        date: format(new Date(), "dd MMM"),
        method: "UPI",
        status: "paid",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to record payment");
    }
  }

  const kpiStats = useMemo(() => {
    const paidSum = items
      .filter((i) => i.status === "paid")
      .reduce((acc, i) => acc + (parseFloat(i.amount.replace(/[^0-9.]/g, "")) || 0), 0);

    const pendingInvoices = items.filter((i) => i.status === "due");
    const pendingSum = pendingInvoices.reduce((acc, i) => acc + (parseFloat(i.amount.replace(/[^0-9.]/g, "")) || 0), 0);

    const overdueInvoices = items.filter((i) => i.status === "overdue");
    const overdueSum = overdueInvoices.reduce((acc, i) => acc + (parseFloat(i.amount.replace(/[^0-9.]/g, "")) || 0), 0);

    const total = paidSum + pendingSum + overdueSum;
    const paidPercent = total > 0 ? Math.round((paidSum / total) * 100) : 0;

    return {
      collectedVal: `₹ ${paidSum.toLocaleString("en-IN")}`,
      collectedRatio: `${paidPercent}%`,
      pendingVal: `₹ ${pendingSum.toLocaleString("en-IN")}`,
      pendingSub: `${pendingInvoices.length} ${pendingInvoices.length === 1 ? "invoice" : "invoices"}`,
      overdueVal: `₹ ${overdueSum.toLocaleString("en-IN")}`,
      overdueSub: `${overdueInvoices.length} ${overdueInvoices.length === 1 ? "tenant" : "tenants"}`,
    };
  }, [items]);

  return (
    <DashboardShell
      title="Rent & Payments"
      subtitle="Collections, dues and payment history"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Collected" value={kpiStats.collectedVal} delta={kpiStats.collectedRatio} tone="up" icon={Wallet} />
        <KpiCard
          label="Pending"
          value={kpiStats.pendingVal}
          delta={kpiStats.pendingSub}
          tone="neutral"
          icon={CreditCard}
        />
        <KpiCard
          label="Overdue"
          value={kpiStats.overdueVal}
          delta={kpiStats.overdueSub}
          tone="down"
          icon={AlertCircle}
        />
        <KpiCard label="MoM growth" value="+8.4%" tone="up" icon={TrendingUp} />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">Invoices · November 2026</h2>
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Rent / Payment</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-3">
                  <div>
                    <Label htmlFor="tenant">Tenant Name</Label>
                    <Select
                      value={form.tenant}
                      onValueChange={(val) => {
                        const foundTenant = allTenants.find((t) => t.name === val);
                        const assignedRoom = foundTenant?.room;
                        const roomObj = assignedRoom ? roomOptions.find((r) => r.room === assignedRoom) : undefined;
                        setForm((prev) => ({
                          ...prev,
                          tenant: val,
                          room: assignedRoom || prev.room,
                          amount: roomObj?.rent
                            ? (roomObj.rent.startsWith("₹") ? roomObj.rent : `₹ ${roomObj.rent}`)
                            : prev.amount,
                        }));
                      }}
                    >
                      <SelectTrigger id="tenant" className="mt-1.5">
                        <SelectValue placeholder="Select Tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {allTenants.length === 0 ? (
                          <SelectItem value="_none" disabled>
                            No tenants found
                          </SelectItem>
                        ) : (
                          allTenants.map((t) => (
                            <SelectItem key={t.id || t.name} value={t.name}>
                              {t.name} {t.room ? `(Room ${t.room})` : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Row 2: Room & Amount */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="room">Room</Label>
                      <Select
                        value={form.room}
                        onValueChange={(val) => {
                          const roomObj = roomOptions.find((r) => r.room === val);
                          setForm((prev) => ({
                            ...prev,
                            room: val,
                            amount: roomObj?.rent
                              ? (roomObj.rent.startsWith("₹") ? roomObj.rent : `₹ ${roomObj.rent}`)
                              : prev.amount,
                          }));
                        }}
                      >
                        <SelectTrigger id="room" className="mt-1.5">
                          <SelectValue placeholder="Select Room" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomOptions.length === 0 ? (
                            <SelectItem value="_none" disabled>
                              No rooms found
                            </SelectItem>
                          ) : (
                            roomOptions.map((r) => (
                              <SelectItem key={r.room} value={r.room}>
                                {r.room} {r.beds ? `(${r.beds} beds)` : ""}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        placeholder="e.g. 11,500"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Row 3: Billing Month & Year & Paid On Date (pod) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Billing Month & Year</Label>
                      <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                        <Select
                          value={selectedMonthName}
                          onValueChange={(m) => handleMonthYearChange(m, selectedYear)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTH_NAMES.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={String(selectedYear)}
                          onValueChange={(y) => handleMonthYearChange(selectedMonthName, Number(y))}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {YEAR_OPTIONS.map((y) => (
                              <SelectItem key={y} value={String(y)}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="date">Paid On Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            disabled={form.status !== "paid"}
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1.5 h-9",
                              !payDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            {payDate ? format(payDate, "dd MMM yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={payDate}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            captionLayout="dropdown"
                            startMonth={new Date(2020, 0)}
                            endMonth={new Date(2030, 11)}
                            onSelect={(d) => {
                              setPayDate(d);
                              if (d) {
                                setCalendarMonth(d);
                                setForm((prev) => ({
                                  ...prev,
                                  date: format(d, "dd MMM"),
                                }));
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Row 4: Payment Method & Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="method">Payment Method</Label>
                      <Select
                        value={form.method}
                        disabled={form.status !== "paid"}
                        onValueChange={(v) => setForm({ ...form, method: v })}
                      >
                        <SelectTrigger id="method" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank">Bank Transfer</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setForm({ ...form, status: v as PayStatus })}
                      >
                        <SelectTrigger id="status" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="due">Due</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitAdd}>Save Payment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
