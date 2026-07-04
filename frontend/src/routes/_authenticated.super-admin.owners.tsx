import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Users, Plus, Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";
import { db } from "@/mock/db";

export const Route = createFileRoute("/_authenticated/super-admin/owners")({
  head: () => ({ meta: [{ title: "Owners · Hostly" }] }),
  component: OwnersPage,
});

const OWNERS = [
  {
    name: "Rajesh Malhotra",
    initials: "RM",
    email: "rajesh@sunrisepg.in",
    properties: 4,
    tenants: 182,
    plan: "Scale",
    mrr: "₹ 12,996",
    status: "active" as const,
    joined: "Mar 2024",
  },
  {
    name: "Meera Krishnan",
    initials: "MK",
    email: "meera@lotusladies.in",
    properties: 1,
    tenants: 42,
    plan: "Growth",
    mrr: "₹ 2,499",
    status: "active" as const,
    joined: "Jul 2024",
  },
  {
    name: "Arvind Rao",
    initials: "AR",
    email: "arvind@urbannest.co",
    properties: 3,
    tenants: 128,
    plan: "Scale",
    mrr: "₹ 12,996",
    status: "active" as const,
    joined: "Jan 2024",
  },
  {
    name: "Kavya Reddy",
    initials: "KR",
    email: "kavya@harmonyhostels.in",
    properties: 2,
    tenants: 76,
    plan: "Growth",
    mrr: "₹ 2,499",
    status: "trial" as const,
    joined: "Nov 2026",
  },
  {
    name: "Prakash Iyer",
    initials: "PI",
    email: "prakash@greentreepg.in",
    properties: 1,
    tenants: 34,
    plan: "Starter",
    mrr: "₹ 999",
    status: "past_due" as const,
    joined: "Sep 2025",
  },
  {
    name: "Nikhil Agarwal",
    initials: "NA",
    email: "nikhil@cozycribs.in",
    properties: 2,
    tenants: 61,
    plan: "Growth",
    mrr: "₹ 2,499",
    status: "active" as const,
    joined: "Feb 2025",
  },
];

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success" },
  trial: { label: "Trial", className: "bg-info/10 text-info" },
  past_due: { label: "Past due", className: "bg-destructive/10 text-destructive" },
};

function OwnersPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(OWNERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hostelName: "",
    planId: "Starter",
  });

  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  function submitInvite() {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.hostelName.trim()) {
      toast.error("All fields are required");
      return;
    }

    const emailLower = form.email.toLowerCase().trim();
    const cleanName = form.name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
    const cleanPhone = form.phone.replace(/\D/g, "");
    const lastFourPhone = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : (cleanPhone || "0000");
    const generatedPassword = `${cleanName}${lastFourPhone}`;

    const workspaceId = `pg_${form.hostelName.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`;
    const userId = `u_owner_${Date.now()}`;
    const initials =
      form.hostelName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "PG";

    // Add new workspace to mock database
    db.workspaces.push({
      id: workspaceId,
      name: form.hostelName,
      ownerId: userId,
      city: "Bengaluru",
      address: "12, MG Road, Bengaluru 560001",
      initials,
      totalBeds: 50,
      occupiedBeds: 0,
      accent: "blue" as const,
      planId: form.planId === "Starter" ? "monthly" : "yearly",
      createdAt: new Date().toISOString(),
    });

    // Add new owner user to mock database
    db.users.push({
      id: userId,
      email: emailLower,
      fullName: form.name,
      phone: form.phone,
      role: "owner",
      workspaceIds: [workspaceId],
      password: generatedPassword,
      createdAt: new Date().toISOString(),
    });

    // Add simulated email from Super Admin to PG Owner
    const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=owner`;
    const newEmail = {
      id: `email_${Date.now()}`,
      from: "super@hostly.app",
      to: emailLower,
      subject: `Hostly Operator Invitation for ${form.name}`,
      body: `Hello ${form.name},

You have been invited by the Hostly Super Admin (super@hostly.app) to manage your PG properties.

Your new workspace "${form.hostelName}" has been successfully created.

Use this link to log in directly:
${linkUrl}

Or log in manually at the login page using the following credentials:
- Username/Email: ${emailLower}
- Password: ${generatedPassword}

Note: The default password consists of the first 4 letters of your name and the last 4 digits of your phone number.`,
      sentAt: new Date().toISOString(),
      linkUrl,
    };

    db.emails.unshift(newEmail);
    db.save();

    // Add to local state list for display in the table
    const parts = form.name.trim().split(/\s+/);
    const initialsName = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "O";

    setItems([
      {
        name: form.name,
        initials: initialsName,
        email: emailLower,
        properties: 1,
        tenants: 0,
        plan: form.planId,
        mrr: form.planId === "Starter" ? "₹ 999" : form.planId === "Growth" ? "₹ 2,499" : "₹ 12,996",
        status: "active" as const,
        joined: "Just now",
      },
      ...items,
    ]);

    setForm({ name: "", email: "", phone: "", hostelName: "", planId: "Starter" });
    setOpen(false);
    toast.success(`Invitation email sent to ${emailLower}`);
  }

  return (
    <DashboardShell
      title="Owners"
      subtitle="Every PG operator on the Hostly platform"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total owners" value={String(items.length)} delta="+3 this week" tone="up" icon={Users} />
        <KpiCard label="Active" value={String(items.filter((i) => i.status === "active").length)} tone="up" icon={Users} />
        <KpiCard label="On trial" value={String(items.filter((i) => i.status === "trial").length)} tone="neutral" icon={Users} />
        <KpiCard label="Past due" value={String(items.filter((i) => i.status === "past_due").length)} tone="down" icon={Users} />
      </div>

      <Card className="mt-6 border-border/70">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search owners…" className="pl-8" />
            </div>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Invite owner
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Tenants</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{o.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{o.name}</p>
                        <p className="text-xs text-muted-foreground">{o.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{o.properties}</TableCell>
                  <TableCell>{o.tenants}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{o.plan}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{o.mrr}</TableCell>
                  <TableCell className="text-muted-foreground">{o.joined}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STATUS[o.status].className}>
                      {STATUS[o.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite Owner Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite New PG Owner</DialogTitle>
            <DialogDescription>
              Create a PG Owner profile. An invitation email with credentials and access link will be sent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Rohan Verma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="rohan@sunrisepg.in"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98200 12345"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hostelName">PG / Hostel Name</Label>
              <Input
                id="hostelName"
                value={form.hostelName}
                onChange={(e) => setForm({ ...form, hostelName: e.target.value })}
                placeholder="Sunrise PG"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <select
                id="plan"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
              >
                <option value="Starter">Starter (₹999/mo)</option>
                <option value="Growth">Growth (₹2,499/mo)</option>
                <option value="Scale">Scale (₹12,996/mo)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitInvite}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
