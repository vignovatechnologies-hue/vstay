import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Users, BedDouble, MessagesSquare, ClipboardList } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { STAFF_NAV } from "@/config/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const taskCompletionData = [
  { name: "Mon", tasks: 8 },
  { name: "Tue", tasks: 12 },
  { name: "Wed", tasks: 15 },
  { name: "Thu", tasks: 10 },
  { name: "Fri", tasks: 14 },
  { name: "Sat", tasks: 5 },
  { name: "Sun", tasks: 2 },
];

export const Route = createFileRoute("/_authenticated/staff/dashboard")({
  head: () => ({ meta: [{ title: "Staff dashboard · Hostly" }] }),
  component: StaffDashboard,
});

function StaffDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  return (
    <DashboardShell
      title={`${ROLE_LABEL[user.role]} dashboard`}
      subtitle="Today's priorities for your shift"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Check-ins today" value="4" icon={Users} />
        <KpiCard
          label="Open complaints"
          value="3"
          delta="1 high priority"
          tone="down"
          icon={MessagesSquare}
        />
        <KpiCard label="Rooms to inspect" value="12" icon={BedDouble} />
        <KpiCard label="Tasks" value="7" delta="2 due today" tone="neutral" icon={ClipboardList} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card className="col-span-1 border-border-default">
          <CardContent className="h-[280px] pt-6">
            <BarChart width={500} height={250} data={taskCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} style={{ width: '100%', height: '100%' }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                contentStyle={{ backgroundColor: "var(--color-popover)", borderColor: "var(--color-border)", color: "var(--color-popover-foreground)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--color-muted-foreground)" }}
              />
              <Bar dataKey="tasks" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border-default">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Role-specific workflows (reception check-in flow, housekeeping board, maintenance queue,
              complaint triage) come online in later phases. The navigation, permissions, and shell
              adapt automatically based on the signed-in role.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
