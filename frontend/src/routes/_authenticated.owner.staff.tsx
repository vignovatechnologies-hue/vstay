import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Plus, Phone, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { shortId } from "@/lib/actions";
import { db } from "@/mock/db";

export const Route = createFileRoute("/_authenticated/owner/staff")({
  head: () => ({ meta: [{ title: "Staff · Hostly" }] }),
  component: StaffPage,
});

type Staff = {
  id: string;
  workspace_id?: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  email: string;
  shift: string;
  status: "active" | "leave";
};

const SEED: Staff[] = [
  {
    id: "s1",
    name: "Devang Shah",
    initials: "DS",
    role: "Manager",
    phone: "+91 98202 33210",
    email: "devang@hostly.app",
    shift: "Day",
    status: "active",
  },
  {
    id: "s2",
    name: "Pooja Nair",
    initials: "PN",
    role: "Reception",
    phone: "+91 98111 22345",
    email: "pooja@hostly.app",
    shift: "Morning",
    status: "active",
  },
  {
    id: "s3",
    name: "Ramesh Kumar",
    initials: "RK",
    role: "Warden",
    phone: "+91 90000 88123",
    email: "ramesh@hostly.app",
    shift: "Night",
    status: "active",
  },
  {
    id: "s4",
    name: "Lakshmi Devi",
    initials: "LD",
    role: "Housekeeping",
    phone: "+91 89765 00121",
    email: "lakshmi@hostly.app",
    shift: "Morning",
    status: "active",
  },
  {
    id: "s5",
    name: "Suresh P.",
    initials: "SP",
    role: "Security",
    phone: "+91 88123 45109",
    email: "suresh@hostly.app",
    shift: "Night",
    status: "leave",
  },
  {
    id: "s6",
    name: "Anita R.",
    initials: "AR",
    role: "Cook",
    phone: "+91 90876 22105",
    email: "anita@hostly.app",
    shift: "Full day",
    status: "active",
  },
];
const STATUS: Record<string, { label: string; variant: "success" | "warning" }> = {
  active: { label: "Active", variant: "success" },
  leave: { label: "On leave", variant: "warning" },
};

function StaffPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, add, update, remove } = useApiCollection<Staff>("/api/staff", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "Reception",
    phone: "",
    email: "",
    shift: "Day",
  });

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function sendInviteEmail(name: string, email: string, rawRole: string, phone: string = "") {
    if (!user) return;
    if (!email || email === "—") {
      toast.error("Staff email is required");
      return;
    }
    const emailLower = email.toLowerCase().trim();
    const resolvedRole = (
      rawRole.toLowerCase() === "manager" ? "manager" : rawRole.toLowerCase()
    ) as any;

    // Generate default password: first 4 characters of name (lowercase, no spaces) + last 4 digits of phone
    const cleanName = name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const lastFourPhone = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : cleanPhone || "0000";
    const generatedPassword = `${cleanName}${lastFourPhone}`;

    toast.success(`Dashboard access URL sent to ${emailLower}`);
  }

  async function invite() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email required");
      return;
    }
    const staffEmail = form.email.trim();
    const parts = form.name.trim().split(/\s+/);
    const initials = parts
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "S";

    try {
      await add({
        workspace_id: activeWorkspace?.id ?? "",
        name: form.name,
        initials,
        role: form.role,
        phone: form.phone || "—",
        email: staffEmail,
        shift: form.shift,
        status: "active",
      });
      sendInviteEmail(form.name, staffEmail, form.role, form.phone);
      setForm({ name: "", role: "Reception", phone: "", email: "", shift: "Day" });
      setOpen(false);
    } catch {
      toast.error("Failed to invite staff");
    }
  }

  return (
    <DashboardShell
      title="Staff"
      subtitle="Manage your on-property team"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total staff" value={String(items.length)} icon={Users} />
        <KpiCard
          label="On duty today"
          value={String(items.filter((s) => s.status === "active").length)}
          tone="up"
          icon={Users}
        />
        <KpiCard
          label="On leave"
          value={String(items.filter((s) => s.status === "leave").length)}
          tone="neutral"
          icon={Users}
        />
        <KpiCard label="Open roles" value="2" tone="neutral" icon={Users} />
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">All roles across shifts</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Invite staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite staff</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Full name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Manager",
                        "Reception",
                        "Warden",
                        "Housekeeping",
                        "Security",
                        "Cook",
                        "Maintenance",
                      ].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shift</Label>
                  <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Morning", "Day", "Night", "Full day"].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={invite}>Send invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((s) => (
          <Card key={s.id} className="border-border-default">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback>{s.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.role} · {s.shift} shift
                      </p>
                    </div>
                    <Badge variant={STATUS[s.status].variant} className="shrink-0 font-bold border-2 shadow-sm">
                      {STATUS[s.status].label}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" /> {s.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> {s.email}
                    </p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const newStatus = s.status === "active" ? "leave" : "active";
                        try {
                          await update(s.id, { status: newStatus });
                          toast.success(`${s.name} → ${newStatus}`);
                        } catch {
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      Toggle status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendInviteEmail(s.name, s.email, s.role, s.phone)}
                    >
                      Send Link
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        try {
                          await remove(s.id);
                          toast.success(`${s.name} removed`);
                        } catch {
                          toast.error("Failed to remove staff");
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive dark:text-destructive-foreground" strokeWidth={2.5} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
