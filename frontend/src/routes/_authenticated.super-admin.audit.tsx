import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ShieldCheck, Search, Filter } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/_authenticated/super-admin/audit")({
  head: () => ({ meta: [{ title: "Audit logs · Hostly" }] }),
  component: AuditPage,
});

const LOGS = [
  {
    t: "12:04 PM",
    actor: "aanya@hostly.app",
    role: "Super Admin",
    action: "workspace.suspended",
    target: "Green Tree PG",
    ip: "103.24.11.8",
    sev: "warn" as const,
  },
  {
    t: "11:42 AM",
    actor: "rajesh@sunrisepg.in",
    role: "Owner",
    action: "billing.plan_upgraded",
    target: "Starter → Scale",
    ip: "49.207.180.22",
    sev: "info" as const,
  },
  {
    t: "10:31 AM",
    actor: "system",
    role: "System",
    action: "invoice.generated",
    target: "INV-11284",
    ip: "—",
    sev: "info" as const,
  },
  {
    t: "09:58 AM",
    actor: "meera@lotusladies.in",
    role: "Owner",
    action: "staff.invited",
    target: "pooja@hostly.app",
    ip: "117.99.44.10",
    sev: "info" as const,
  },
  {
    t: "09:12 AM",
    actor: "unknown",
    role: "—",
    action: "auth.login_failed",
    target: "kavya@harmonyhostels.in",
    ip: "42.108.19.7",
    sev: "danger" as const,
  },
  {
    t: "Yesterday 08:14 PM",
    actor: "aanya@hostly.app",
    role: "Super Admin",
    action: "role.granted",
    target: "vikram@hostly.app · Support",
    ip: "103.24.11.8",
    sev: "warn" as const,
  },
  {
    t: "Yesterday 06:30 PM",
    actor: "arvind@urbannest.co",
    role: "Owner",
    action: "property.created",
    target: "Urban Nest · Whitefield",
    ip: "49.207.222.90",
    sev: "info" as const,
  },
];

const SEV: Record<string, "info" | "warning" | "danger"> = {
  info: "info",
  warn: "warning",
  danger: "danger",
};

function AuditPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title="Audit logs"
      subtitle="Every privileged action across the platform"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Events today" value="284" icon={ShieldCheck} />
        <KpiCard label="Failed logins (24h)" value="12" tone="down" icon={ShieldCheck} />
        <KpiCard label="Privileged changes" value="9" tone="neutral" icon={ShieldCheck} />
        <KpiCard label="Retention" value="90 days" icon={ShieldCheck} />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search actor, action or target…" className="pl-8 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-3.5 w-3.5" /> Filter
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOGS.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="whitespace-nowrap text-muted-foreground dark:text-[#94A3B8] font-medium">{l.t}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F1F5F9]">{l.actor}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{l.role}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#A8B4C5]">{l.action}</TableCell>
                  <TableCell className="text-foreground dark:text-[#E2E8F0] font-medium">{l.target}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#718096]">{l.ip}</TableCell>
                  <TableCell>
                    <Badge variant={SEV[l.sev]} className="capitalize">
                      {l.sev}
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
