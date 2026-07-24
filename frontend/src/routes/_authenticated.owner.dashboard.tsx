import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import {
  BedDouble,
  Users,
  CreditCard,
  Building2,
  AlertCircle,
  PlusCircle,
  Wrench,
  Megaphone,
  UserPlus,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import {
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

export const Route = createFileRoute("/_authenticated/owner/dashboard")({
  head: () => ({ meta: [{ title: "Owner dashboard · Vstay" }] }),
  component: OwnerDashboard,
});

// Mock revenue data for Owner
const revenueData = [
  { name: "Jul", revenue: 320000 },
  { name: "Aug", revenue: 350000 },
  { name: "Sep", revenue: 345000 },
  { name: "Oct", revenue: 410000 },
  { name: "Nov", revenue: 462000 },
  { name: "Dec", revenue: 485000 },
];

const COLORS = ["#4F6EF7", "#314462"]; // primary blue, muted border for vacant

function OwnerDashboard() {
  const { user } = useAuth();
  const { activeWorkspace, workspaces } = useWorkspace();
  const navigate = useNavigate();

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;
  if (user.workspaceIds.length > 1 && !activeWorkspace) {
    return <Navigate to="/workspace-select" />;
  }

  const w = activeWorkspace ?? workspaces[0] ?? null;
  const occupancyRate = w ? Math.round((w.occupiedBeds / w.totalBeds) * 100) : 0;
  
  const occupancyData = w
    ? [
        { name: "Occupied", value: w.occupiedBeds },
        { name: "Vacant", value: w.totalBeds - w.occupiedBeds },
      ]
    : [];

  return (
    <DashboardShell
      title="Owner Dashboard"
      subtitle="Manage your properties, occupancy, tenants, payments and daily operations."
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      {!w ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <h2 className="text-base font-semibold">No property selected</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Pick a workspace from the top bar to see its dashboard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* KPI GRID */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Active Tenants"
              value={w.occupiedBeds.toString()}
              delta="+4 this month"
              icon={Users}
              tone="up"
            />
            <KpiCard
              label="Available Beds"
              value={(w.totalBeds - w.occupiedBeds).toString()}
              delta={`${occupancyRate}% occupancy`}
              icon={BedDouble}
              tone="neutral"
            />
            <KpiCard
              label="Pending Payments"
              value="₹ 45K"
              delta="3 tenants overdue"
              icon={CreditCard}
              tone="down"
            />
            <KpiCard
              label="Today's Visitors"
              value="12"
              delta="4 check-ins scheduled"
              icon={UserPlus}
              tone="neutral"
            />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Rent Collection (6 Months)</CardTitle>
                <CardDescription>Monthly operational revenue across your PG.</CardDescription>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)" }}
                      contentStyle={{ backgroundColor: "var(--color-popover)", borderColor: "var(--color-border)", color: "var(--color-popover-foreground)", borderRadius: "8px" }}
                      itemStyle={{ color: "var(--color-muted-foreground)" }}
                    />
                    <Bar dataKey="revenue" fill="#4F6EF7" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Occupancy Overview</CardTitle>
                <CardDescription>{w.name} Capacity</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[280px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {occupancyData.map((entry, index) => (
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
                  <span className="text-3xl font-bold tracking-tight">{occupancyRate}%</span>
                  <span className="text-xs text-muted-foreground">Occupied</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI INSIGHTS & QUICK ACTIONS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20 lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Vstay AI Insights (Demo)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                    <TrendingUp className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    <strong>Revenue Opportunity:</strong> You have {w.totalBeds - w.occupiedBeds} vacant beds. Running a short-term promotional offer could increase your monthly revenue by approximately ₹1.2L.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 rounded-full bg-amber-500/10 p-1">
                    <AlertCircle className="h-3 w-3 text-amber-600" />
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    <strong>Payment Alert:</strong> Room 204 (Arjun Kapoor) is 5 days overdue on rent. Consider sending an automated WhatsApp reminder.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start h-9" onClick={() => navigate({ to: "/owner/tenants", search: { action: "add-tenant" } })}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Tenant
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => navigate({ to: "/owner/payments" })}>
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => navigate({ to: "/owner/complaints" })}>
                  <Megaphone className="mr-2 h-4 w-4" /> Create Notice
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => navigate({ to: "/owner/rooms" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* TABLES / LISTS */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">Recent Complaints</CardTitle>
                  <CardDescription>Tenant issues requiring attention</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate({ to: "/owner/complaints" })}>
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { id: "C-1029", room: "201", issue: "AC not cooling", status: "Open", priority: "High" },
                    { id: "C-1028", room: "105", issue: "WiFi dropping", status: "In Progress", priority: "Medium" },
                    { id: "C-1027", room: "304", issue: "Leaking tap", status: "Open", priority: "Low" },
                  ].map((complaint) => (
                    <div key={complaint.id} className="group relative flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer dark:bg-[rgba(17,30,49,0.5)] dark:border-white/5 dark:hover:border-primary/30 dark:hover:bg-[rgba(37,99,235,0.06)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                      <div className="relative z-10 flex flex-col gap-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{complaint.issue}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-[10px] font-medium">{complaint.room}</span>
                          • {complaint.id}
                        </p>
                      </div>
                      <Badge variant={complaint.status === "Open" ? "destructive" : "secondary"} className="relative z-10 shadow-sm font-medium">
                        {complaint.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">Maintenance Tasks</CardTitle>
                  <CardDescription>Assigned staff operations</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate({ to: "/owner/staff" })}>
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { id: "M-402", task: "Deep Clean Room 102", assignee: "Ramesh (Housekeeping)", status: "Pending" },
                    { id: "M-401", task: "Fix AC in 201", assignee: "Suresh (Maintenance)", status: "In Progress" },
                    { id: "M-400", task: "Monthly Pest Control", assignee: "External Vendor", status: "Scheduled" },
                  ].map((task) => (
                    <div key={task.id} className="group relative flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer dark:bg-[rgba(17,30,49,0.5)] dark:border-white/5 dark:hover:border-primary/30 dark:hover:bg-[rgba(37,99,235,0.06)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                      <div className="relative z-10 flex items-start gap-3.5">
                        <div className="mt-0.5 rounded-md bg-primary/10 dark:bg-primary/20 p-2 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{task.task}</p>
                          <p className="text-xs text-muted-foreground font-medium">{task.assignee}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="relative z-10 bg-background/50 backdrop-blur-sm border-border/50">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
