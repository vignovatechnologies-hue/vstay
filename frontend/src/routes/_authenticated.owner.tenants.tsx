import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, Plus, Search, Phone, Mail, Trash2, Send } from "lucide-react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/providers/auth-provider";
import { OWNER_NAV } from "@/config/navigation";
import { KpiCard } from "@/components/layout/kpi-card";
import { useLocalCollection } from "@/lib/local-store";
import { shortId, formatShortDate } from "@/lib/actions";
import { db } from "@/mock/db";

export const Route = createFileRoute("/_authenticated/owner/tenants")({
  head: () => ({ meta: [{ title: "Tenants · Hostly" }] }),
  component: TenantsPage,
});

type Tenant = {
  id: string;
  name: string;
  initials: string;
  room: string;
  phone: string;
  email: string;
  since: string;
  rent: "paid" | "due" | "overdue";
  kyc: "verified" | "pending";
};

const SEED: Tenant[] = [
  {
    id: "t1",
    name: "Arjun Kapoor",
    initials: "AK",
    room: "204·B",
    phone: "+91 90000 11122",
    email: "arjun@mail.com",
    since: "May 2025",
    rent: "paid",
    kyc: "verified",
  },
  {
    id: "t2",
    name: "Vikram Singh",
    initials: "VS",
    room: "204·A",
    phone: "+91 98232 00981",
    email: "vikram@mail.com",
    since: "Mar 2025",
    rent: "paid",
    kyc: "verified",
  },
  {
    id: "t3",
    name: "Nikhil Rao",
    initials: "NR",
    room: "204·C",
    phone: "+91 91234 55211",
    email: "nikhil@mail.com",
    since: "Aug 2025",
    rent: "due",
    kyc: "verified",
  },
  {
    id: "t4",
    name: "Priya Sharma",
    initials: "PS",
    room: "201·A",
    phone: "+91 93000 44521",
    email: "priya@mail.com",
    since: "Jan 2025",
    rent: "paid",
    kyc: "pending",
  },
  {
    id: "t5",
    name: "Rahul Menon",
    initials: "RM",
    room: "101",
    phone: "+91 90111 22345",
    email: "rahul@mail.com",
    since: "Nov 2024",
    rent: "overdue",
    kyc: "verified",
  },
  {
    id: "t6",
    name: "Sneha Iyer",
    initials: "SI",
    room: "301·A",
    phone: "+91 98876 00021",
    email: "sneha@mail.com",
    since: "Jun 2025",
    rent: "paid",
    kyc: "verified",
  },
];

const RENT: Record<string, string> = {
  paid: "bg-success/10 text-success",
  due: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};
const KYC: Record<string, string> = {
  verified: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
};

function TenantsPage() {
  const { user } = useAuth();
  const { items, add, remove } = useLocalCollection<Tenant>("hostly.owner.tenants", SEED);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Tenant | null>(null);
  const [form, setForm] = useState({ name: "", room: "", phone: "", email: "" });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((t) =>
      `${t.name} ${t.room} ${t.email} ${t.phone}`.toLowerCase().includes(s),
    );
  }, [items, q]);

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function sendInviteEmail(name: string, email: string, phone: string = "") {
    if (!user) return;
    if (!email || email === "—") {
      toast.error("Tenant has no email address configured");
      return;
    }
    const emailLower = email.toLowerCase().trim();

    // Generate default password: first 4 characters of name (lowercase, no spaces) + last 4 digits of phone
    const cleanName = name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const lastFourPhone = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : (cleanPhone || "0000");
    const generatedPassword = `${cleanName}${lastFourPhone}`;

    // Add to mock db users if not exists so the URL log in works
    const exists = db.users.some((u) => u.email.toLowerCase() === emailLower);
    if (!exists) {
      db.users.push({
        id: `u_${shortId("t")}`,
        email: emailLower,
        fullName: name,
        phone: phone || undefined,
        role: "tenant",
        workspaceIds: user.workspaceIds,
        password: generatedPassword,
        createdAt: new Date().toISOString(),
      });
    } else {
      // Update their password and phone just in case
      const existingUser = db.users.find((u) => u.email.toLowerCase() === emailLower);
      if (existingUser) {
        existingUser.password = generatedPassword;
        if (phone) {
          existingUser.phone = phone;
        }
      }
    }

    // Add to mock emails
    const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=tenant`;
    const newEmail = {
      id: `email_${Date.now()}`,
      from: user.email,
      to: emailLower,
      subject: `Hostly Access Link for ${name}`,
      body: `Hello ${name},

Your PG Owner (${user.fullName} - ${user.email}) has invited you to access your Hostly Tenant Dashboard.

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
    toast.success(`Dashboard access URL sent to ${emailLower}`);
  }

  function submitAdd() {
    if (!form.name.trim() || !form.room.trim()) {
      toast.error("Name and room are required");
      return;
    }
    const parts = form.name.trim().split(/\s+/);
    const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "T";
    const tenantEmail = form.email.trim();
    add({
      id: shortId("t"),
      name: form.name,
      initials,
      room: form.room,
      phone: form.phone || "—",
      email: tenantEmail || "—",
      since: formatShortDate(),
      rent: "due",
      kyc: "pending",
    });

    if (tenantEmail) {
      sendInviteEmail(form.name, tenantEmail, form.phone);
    }

    setForm({ name: "", room: "", phone: "", email: "" });
    setOpen(false);
    toast.success(`${form.name} added`);
  }
  function del(t: Tenant) {
    remove(t.id);
    toast.success(`${t.name} removed`);
  }

  return (
    <DashboardShell
      title="Tenants"
      subtitle="All active residents across your property"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total tenants" value={String(items.length)} icon={Users} />
        <KpiCard
          label="Rent paid"
          value={String(items.filter((t) => t.rent === "paid").length)}
          tone="up"
          icon={Users}
        />
        <KpiCard
          label="Rent due"
          value={String(items.filter((t) => t.rent !== "paid").length)}
          tone="neutral"
          icon={Users}
        />
        <KpiCard
          label="KYC pending"
          value={String(items.filter((t) => t.kyc === "pending").length)}
          tone="neutral"
          icon={Users}
        />
      </div>

      <Card className="mt-6 border-border/70">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 p-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants…"
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Add tenant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add tenant</DialogTitle>
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
                    <Label>Room</Label>
                    <Input
                      value={form.room}
                      onChange={(e) => setForm({ ...form, room: e.target.value })}
                      placeholder="e.g. 204·B"
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
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitAdd}>Add tenant</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Since</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{t.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.room}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {t.phone}
                      </p>
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {t.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.since}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={RENT[t.rent]}>
                      {t.rent}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={KYC[t.kyc]}>
                      {t.kyc}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => setView(t)}>
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendInviteEmail(t.name, t.email, t.phone)}
                      title="Send access link email"
                    >
                      Send Link
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => del(t)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No tenants match.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.name}</DialogTitle>
            <DialogDescription>Tenant profile</DialogDescription>
          </DialogHeader>
          {view && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Room:</span>{" "}
                <span className="font-medium">{view.room}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span>{" "}
                <span className="font-medium">{view.phone}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{view.email}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Since:</span>{" "}
                <span className="font-medium">{view.since}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Rent:</span>{" "}
                <Badge variant="secondary" className={RENT[view.rent]}>
                  {view.rent}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">KYC:</span>{" "}
                <Badge variant="secondary" className={KYC[view.kyc]}>
                  {view.kyc}
                </Badge>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
