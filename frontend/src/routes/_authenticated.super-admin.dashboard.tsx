import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import {
  Users,
  Building2,
  CreditCard,
  ShieldCheck,
  Tag,
  Activity,
  Server,
  Database,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/mock/db";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/super-admin/dashboard")({
  head: () => ({ meta: [{ title: "Platform overview · Hostly" }] }),
  component: SuperAdminDashboard,
});

// Mock platform data for Super Admin
const mrrGrowthData = [
  { name: "Jul", mrr: 4.2 },
  { name: "Aug", mrr: 4.8 },
  { name: "Sep", mrr: 5.5 },
  { name: "Oct", mrr: 6.8 },
  { name: "Nov", mrr: 7.9 },
  { name: "Dec", mrr: 8.4 },
];

const orgGrowthData = [
  { name: "Jul", newOrgs: 12 },
  { name: "Aug", newOrgs: 18 },
  { name: "Sep", newOrgs: 25 },
  { name: "Oct", newOrgs: 22 },
  { name: "Nov", newOrgs: 34 },
  { name: "Dec", newOrgs: 17 },
];

const subscriptionDistribution = [
  { name: "Yearly", value: 45 },
  { name: "Monthly", value: 75 },
  { name: "Trial", value: 8 },
];

const COLORS = ["#4F6EF7", "#10B981", "#F59E0B"]; // blue, emerald, amber

function SuperAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  // Mock global aggregates
  const totalOrgs = db.workspaces.length;
  const totalOwners = db.users.filter(u => u.role === "owner").length;
  const totalUsers = db.users.length;

  return (
    <DashboardShell
      title="Super Admin Dashboard"
      subtitle="Monitor organizations, subscriptions, platform growth and system operations."
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="space-y-6">
        {/* KPI GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Total Organizations"
            value={totalOrgs.toString()}
            delta="+3 this week"
            icon={Building2}
            tone="up"
          />
          <KpiCard
            label="Total PG Owners"
            value={totalOwners.toString()}
            delta="+2 this week"
            icon={Users}
            tone="up"
          />
          <KpiCard
            label="Platform Users"
            value={totalUsers.toString()}
            delta="+45 this month"
            icon={Users}
            tone="neutral"
          />
          <KpiCard
            label="Active Subscriptions"
            value="120"
            delta="94% retention"
            icon={Tag}
            tone="up"
          />
          <KpiCard
            label="Platform MRR"
            value="₹ 8.4L"
            delta="+12.4% MoM"
            icon={CreditCard}
            tone="up"
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Platform MRR Growth (6 Months)</CardTitle>
              <CardDescription>Recurring subscription revenue in Lakhs (₹)</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mrrGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}L`}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3", opacity: 0.5 }}
                    contentStyle={{ backgroundColor: "var(--color-popover)", borderColor: "var(--color-border)", color: "var(--color-popover-foreground)", borderRadius: "8px" }}
                    itemStyle={{ color: "var(--color-muted-foreground)" }}
                  />
                  <Line type="monotone" dataKey="mrr" stroke="#4F6EF7" strokeWidth={3} dot={{ fill: "#111C2E", r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Subscription Plans</CardTitle>
              <CardDescription>Current active distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[280px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {subscriptionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--color-popover)", borderColor: "var(--color-border)", color: "var(--color-popover-foreground)", borderRadius: "8px" }}
                    itemStyle={{ color: "var(--color-muted-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-bold tracking-tight">128</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLES & SYSTEM STATUS */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* RECENT ORGANIZATIONS TABLE */}
          <section className="md:col-span-2 w-full">
            <div className="flex flex-row items-center justify-between pb-2 mb-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-foreground dark:text-[#F8FAFC]">Recent Organizations</h2>
                <p className="text-sm text-muted-foreground">Latest PG workspaces joined platform</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground dark:text-[#CBD5E1] dark:hover:text-[#60A5FA] bg-transparent" onClick={() => navigate({ to: "/super-admin/properties" })}>
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="w-full">
              {/* LIGHT MODE: Spreadsheet Table */}
              <div className="block dark:hidden overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Owner ID</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {db.workspaces.slice(0, 4).map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{org.name}</TableCell>
                        <TableCell className="text-muted-foreground dark:text-[#A8B4C5] text-xs font-mono">{org.ownerId}</TableCell>
                        <TableCell>
                          <Badge variant="category">{org.planId === "yearly" ? "Yearly" : "Monthly"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* DARK MODE: Professional Separated Records */}
              <div className="hidden dark:flex flex-col gap-2 mt-2">
                {db.workspaces.slice(0, 4).map((org) => (
                  <div key={org.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-[14px_16px] rounded-[10px] bg-[rgba(17,30,49,0.68)] border border-[rgba(100,116,139,0.14)] hover:bg-[rgba(37,99,235,0.08)] transition-colors duration-150">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-[#F1F5F9]">{org.name}</span>
                      <span className="text-[#8492A6] text-xs font-mono">Owner: {org.ownerId}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                      <Badge variant="category">{org.planId === "yearly" ? "Yearly" : "Monthly"}</Badge>
                      <Badge variant="success">Active</Badge>
                      <Button variant="ghost" size="sm" className="ml-2 text-[#60A5FA] hover:text-[#93C5FD] hover:bg-transparent px-2 -mr-2" onClick={() => navigate({ to: "/super-admin/properties" })}>
                        View <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SYSTEM HEALTH & ACTIVITY */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">System Health (Mock)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">API Gateway</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Database (Mock)</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Background Jobs</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50">Operational</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Platform Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-blue-100 p-1">
                    <Building2 className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New organization created</p>
                    <p className="text-xs text-muted-foreground">Skyline Stays just registered.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
                    <Tag className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Subscription upgraded</p>
                    <p className="text-xs text-muted-foreground">Lotus Ladies PG moved to Yearly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-rose-100 p-1">
                    <ShieldCheck className="h-3 w-3 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account suspended</p>
                    <p className="text-xs text-muted-foreground">Violation on u_owner_902.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
