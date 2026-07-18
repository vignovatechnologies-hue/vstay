import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Building2, Search, Filter } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

export const Route = createFileRoute("/_authenticated/super-admin/properties")({
  head: () => ({ meta: [{ title: "Properties · Hostly" }] }),
  component: PropertiesPage,
});

const PROPS = [
  {
    name: "Sunrise PG · Andheri",
    owner: "Rajesh Malhotra",
    city: "Mumbai",
    beds: 82,
    occ: 94,
    tier: "Premium",
  },
  {
    name: "Sunrise PG · Powai",
    owner: "Rajesh Malhotra",
    city: "Mumbai",
    beds: 64,
    occ: 88,
    tier: "Premium",
  },
  {
    name: "Lotus Ladies PG",
    owner: "Meera Krishnan",
    city: "Mumbai",
    beds: 48,
    occ: 92,
    tier: "Standard",
  },
  {
    name: "Urban Nest · HSR",
    owner: "Arvind Rao",
    city: "Bengaluru",
    beds: 96,
    occ: 97,
    tier: "Premium",
  },
  {
    name: "Urban Nest · Koramangala",
    owner: "Arvind Rao",
    city: "Bengaluru",
    beds: 72,
    occ: 85,
    tier: "Premium",
  },
  {
    name: "Harmony Hostels",
    owner: "Kavya Reddy",
    city: "Hyderabad",
    beds: 54,
    occ: 74,
    tier: "Standard",
  },
  {
    name: "Green Tree PG",
    owner: "Prakash Iyer",
    city: "Chennai",
    beds: 38,
    occ: 61,
    tier: "Starter",
  },
  {
    name: "Cozy Cribs · Sector 62",
    owner: "Nikhil Agarwal",
    city: "Noida",
    beds: 66,
    occ: 90,
    tier: "Standard",
  },
];

function PropertiesPage() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title="Properties"
      subtitle="All PG properties active on the platform"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total properties"
          value="128"
          delta="+6 this month"
          tone="up"
          icon={Building2}
        />
        <KpiCard label="Total beds" value="8,412" delta="+184" tone="up" icon={Building2} />
        <KpiCard label="Avg. occupancy" value="87%" delta="+2.1%" tone="up" icon={Building2} />
        <KpiCard label="Cities live" value="14" icon={Building2} />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search property or owner…" className="pl-8 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-3.5 w-3.5" /> Filter
            </Button>
          </div>
          <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Beds</TableHead>
                <TableHead className="w-[200px]">Occupancy</TableHead>
                <TableHead>Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROPS.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{p.owner}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{p.city}</TableCell>
                  <TableCell className="text-foreground dark:text-[#F8FAFC] font-semibold tabular-nums">{p.beds}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.occ} className="h-1.5 w-24" />
                      <span className="text-xs tabular-nums text-muted-foreground dark:text-[#94A3B8] font-medium">{p.occ}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="category">{p.tier}</Badge>
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
