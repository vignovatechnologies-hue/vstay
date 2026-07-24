import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { CreditCard, BedDouble, MessagesSquare, FileText } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyExpensesData = [
  { name: "Jul", amount: 11000 },
  { name: "Aug", amount: 11500 },
  { name: "Sep", amount: 12000 },
  { name: "Oct", amount: 11500 },
  { name: "Nov", amount: 12500 },
  { name: "Dec", amount: 11500 },
];

export const Route = createFileRoute("/_authenticated/tenant/dashboard")({
  head: () => ({ meta: [{ title: "My stay · Vstay" }] }),
  component: TenantDashboard,
});

function TenantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title={`Hello, ${user.fullName.split(" ")[0]}`}
      subtitle="Your stay at Greenhaven Residency, Room 204"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Next rent due"
          value="Dec 5"
          delta="₹ 11,500"
          icon={CreditCard}
          tone="neutral"
        />
        <KpiCard label="Room" value="204 · Bed B" icon={BedDouble} />
        <KpiCard
          label="Open requests"
          value="1"
          delta="In progress"
          icon={MessagesSquare}
          tone="neutral"
        />
        <KpiCard label="Documents" value="3" delta="All verified" icon={FileText} tone="up" />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card className="col-span-1 md:col-span-2 border-border-default">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Expense History (6 Months)</CardTitle>
            <CardDescription>Your rent and utility payments</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <AreaChart width={500} height={250} data={monthlyExpensesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6EF7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F6EF7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                cursor={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3", opacity: 0.5 }}
                contentStyle={{ backgroundColor: "var(--color-popover)", borderColor: "var(--color-border)", color: "var(--color-popover-foreground)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--color-muted-foreground)" }}
              />
              <Area type="monotone" dataKey="amount" stroke="#4F6EF7" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border-default">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Coming up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Rent payment with UPI/cards, deposit & receipt history, complaint filing with photo
              uploads, food/laundry preferences and digital agreements come online in the tenant
              phase.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Button size="sm" onClick={() => navigate({ to: "/tenant/payments" })}>
                Pay rent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/tenant/complaints" })}
              >
                Raise complaint
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/tenant/vehicles", search: { action: "add-vehicle" } })}
              >
                Add vehicle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
