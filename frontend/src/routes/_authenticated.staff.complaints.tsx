import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessagesSquare, Filter } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
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
import { STAFF_NAV } from "@/config/navigation";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { useWorkspace } from "@/providers/workspace-provider";

export const Route = createFileRoute("/_authenticated/staff/complaints")({
  head: () => ({ meta: [{ title: "Complaints · Vstay" }] }),
  component: StaffComplaintsPage,
});

type CStatus = "open" | "in_progress" | "resolved";
type Prio = "high" | "medium" | "low";
type Complaint = {
  id: string;
  tenant: string;
  room: string;
  category: string;
  subject: string;
  raised: string;
  priority: Prio;
  status: CStatus;
};

const SEED: Complaint[] = [
  {
    id: "CMP-341",
    tenant: "Arjun Kapoor",
    room: "204·B",
    category: "Maintenance",
    subject: "AC not cooling",
    raised: "01 Dec",
    priority: "high",
    status: "open",
  },
  {
    id: "CMP-340",
    tenant: "Priya Sharma",
    room: "201·A",
    category: "Internet",
    subject: "Slow Wi-Fi in evenings",
    raised: "30 Nov",
    priority: "medium",
    status: "in_progress",
  },
  {
    id: "CMP-339",
    tenant: "Rahul Menon",
    room: "101",
    category: "Housekeeping",
    subject: "Bathroom cleaning skipped",
    raised: "29 Nov",
    priority: "low",
    status: "in_progress",
  },
  {
    id: "CMP-338",
    tenant: "Sneha Iyer",
    room: "301·A",
    category: "Food",
    subject: "Dinner served late",
    raised: "27 Nov",
    priority: "low",
    status: "resolved",
  },
  {
    id: "CMP-337",
    tenant: "Vikram Singh",
    room: "204·A",
    category: "Maintenance",
    subject: "Wardrobe hinge broken",
    raised: "25 Nov",
    priority: "medium",
    status: "resolved",
  },
];
const PRIO: Record<Prio, "danger" | "warning" | "info"> = {
  high: "danger",
  medium: "warning",
  low: "info",
};
const STATUS: Record<CStatus, { label: string; variant: "danger" | "warning" | "success" }> = {
  open: { label: "Open", variant: "danger" },
  in_progress: { label: "In progress", variant: "warning" },
  resolved: { label: "Resolved", variant: "success" },
};

function StaffComplaintsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, update } = useApiCollection<Complaint>("/api/complaints", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const [filter, setFilter] = useState<"all" | CStatus>("all");
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter],
  );

  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  async function setStatus(c: Complaint, s: CStatus) {
    try {
      await update(c.id, { status: s });
      toast.success(`${c.id} → ${STATUS[s].label}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <DashboardShell
      title="Complaints"
      subtitle="Tickets raised by tenants across the property"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Open"
          value={String(items.filter((c) => c.status === "open").length)}
          tone="down"
          icon={MessagesSquare}
        />
        <KpiCard
          label="In progress"
          value={String(items.filter((c) => c.status === "in_progress").length)}
          tone="neutral"
          icon={MessagesSquare}
        />
        <KpiCard
          label="Resolved"
          value={String(items.filter((c) => c.status === "resolved").length)}
          tone="up"
          icon={MessagesSquare}
        />
        <KpiCard label="Avg. resolution" value="18 hrs" tone="up" icon={MessagesSquare} />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">All complaints</h2>
            <Select value={filter} onValueChange={(v) => setFilter(v as "all" | CStatus)}>
              <SelectTrigger className="h-8 w-[150px]">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#CBD5E1] font-medium">{c.id}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{c.tenant}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#718096]">
                    {c.room}
                  </TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{c.category}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#E2E8F0] font-medium">{c.subject}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{c.raised}</TableCell>
                  <TableCell>
                    <Badge variant={PRIO[c.priority]} className="capitalize">
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS[c.status].variant}>
                      {STATUS[c.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select value={c.status} onValueChange={(v) => setStatus(c, v as CStatus)}>
                      <SelectTrigger className="h-8 w-[130px] ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
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
