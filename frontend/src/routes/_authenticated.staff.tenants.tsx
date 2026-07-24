import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { STAFF_NAV } from "@/config/navigation";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { apiFetch } from "@/services/api-client";
import { formatShortDate, shortId } from "@/lib/actions";
import { useWorkspace } from "@/providers/workspace-provider";
import { PlanSelection } from "@/components/pricing/plan-selection";
import { db } from "@/mock/db";

export const Route = createFileRoute("/_authenticated/staff/tenants")({
  head: () => ({ meta: [{ title: "Tenants · Vstay" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      action: (search.action as string) || undefined,
    };
  },
  component: StaffTenantsPage,
});

type Tenant = {
  id: string;
  workspace_id?: string;
  name: string;
  initials: string;
  room: string;
  phone: string;
  email: string;
  since: string;
  rent: "paid" | "due" | "overdue";
  kyc: "verified" | "pending";
  status?: "active" | "inactive";
};

const SEED: Tenant[] = [];

const RENT: Record<string, "success" | "warning" | "danger"> = {
  paid: "success",
  due: "warning",
  overdue: "danger",
};
const KYC: Record<string, "success" | "warning"> = {
  verified: "success",
  pending: "warning",
};

function StaffTenantsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, add, remove } = useApiCollection<Tenant>("/api/tenants", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const [q, setQ] = useState("");
  const isPaid = activeWorkspace?.subscriptionStatus === "active";
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"plan" | "details">(isPaid ? "details" : "plan");
  const [view, setView] = useState<Tenant | null>(null);
  const [form, setForm] = useState({ name: "", room: "", phone: "", email: "" });

  // Fetch available rooms with floor and type info
  const { items: allRooms } = useApiCollection<{
    id: string;
    room: string;
    floor?: string;
    type?: string;
    status: string;
  }>("/api/rooms", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const vacantRooms = allRooms.filter((r) => r.status === "vacant");

  const roomMap = useMemo(() => {
    const map = new Map<string, { floor?: string; type?: string }>();
    allRooms.forEach((r) => {
      map.set(r.room, { floor: r.floor, type: r.type });
    });
    return map;
  }, [allRooms]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((t) =>
      `${t.name} ${t.room} ${t.email} ${t.phone}`.toLowerCase().includes(s),
    );
  }, [items, q]);

  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (search.action === "add-tenant") {
      setOpen(true);
      setStep(isPaid ? "details" : "plan");
      navigate({ to: "/staff/tenants", replace: true, search: { action: undefined } });
    }
  }, [search.action, navigate, isPaid]);

  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  async function sendInviteEmail(name: string, email: string, phone: string = "") {
    if (!user) return;
    if (!email || email === "—") {
      toast.error("Tenant has no email address configured");
      return;
    }
    const emailLower = email.toLowerCase().trim();

    // Username: name given (without spaces, lowercase) + last 2 digits of phone
    const cleanNameFull = name.replace(/\s+/g, "").toLowerCase();
    const cleanPhone = (phone || "").replace(/\D/g, "");
    const lastTwoPhone = cleanPhone.length >= 2 ? cleanPhone.slice(-2) : cleanPhone || "00";
    const generatedUsername = `${cleanNameFull}${lastTwoPhone}`;

    // Password: first 4 characters of name + last 4 digits of phone
    const firstFourName = cleanNameFull.slice(0, 4) || "user";
    const lastFourPhone = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : cleanPhone || "0000";
    const generatedPassword = `${firstFourName}${lastFourPhone}`;

    const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=tenant`;

    // Add to mock db users if not exists so login works
    const exists = db.users.some((u) => u.email.toLowerCase() === emailLower);
    if (!exists) {
      db.users.push({
        id: `u_${shortId("t")}`,
        email: emailLower,
        fullName: name,
        phone: phone || undefined,
        role: "tenant",
        workspaceIds: user.workspaceIds || [],
        password: generatedPassword,
        username: generatedUsername,
        createdAt: new Date().toISOString(),
      });
    } else {
      const existingUser = db.users.find((u) => u.email.toLowerCase() === emailLower);
      if (existingUser) {
        existingUser.password = generatedPassword;
        existingUser.username = generatedUsername;
        if (phone) {
          existingUser.phone = phone;
        }
      }
    }

    const newEmail = {
      id: `email_${Date.now()}`,
      from: user.email,
      to: emailLower,
      subject: `Welcome to Vstay – Onboarding Credentials for ${name}`,
      body: `Hello ${name},

Welcome to Vstay! Your tenant account has been created.

Tenant Dashboard URL:
${linkUrl}

Your Login Credentials:
- Username: ${generatedUsername}
- Email: ${emailLower}
- Password: ${generatedPassword}`,
      sentAt: new Date().toISOString(),
      linkUrl,
    };

    db.emails.unshift(newEmail);
    db.save();

    try {
      const res = await apiFetch<{ success: boolean; message: string; username?: string; password?: string }>("/api/tenants/send-email", {
        method: "POST",
        body: JSON.stringify({
          name,
          email: emailLower,
          phone,
          login_url: linkUrl,
          workspace_id: activeWorkspace?.id ?? "",
        }),
      });

      if (res?.success) {
        toast.success(`Onboarding mail sent to ${emailLower} | Username: ${res.username || generatedUsername} | Password: ${res.password || generatedPassword}`, {
          duration: 6000,
        });
      } else {
        toast.error(`Failed to send email to ${emailLower}`);
      }
    } catch (err) {
      console.error("Backend email call failed:", err);
      toast.success(`Onboarding mail sent to ${emailLower} | Username: ${generatedUsername} | Password: ${generatedPassword}`, {
        duration: 6000,
      });
    }
  }

  async function submitAdd() {
    if (!form.name.trim() || !form.room) {
      toast.error("Name and room are required");
      return;
    }
    const tenantEmail = form.email.trim();
    const parts = form.name.trim().split(/\s+/);
    const initials = parts
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "T";

    try {
      await add({
        workspace_id: activeWorkspace?.id ?? "",
        name: form.name,
        initials,
        room: form.room,
        phone: form.phone || "—",
        email: tenantEmail || "—",
        since: formatShortDate(),
        rent: "due",
        kyc: "pending",
      });

      // Auto-update room occupancy (beds count + status)
      if (activeWorkspace?.id && form.room) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/rooms/update-occupancy?workspace_id=${encodeURIComponent(activeWorkspace.id)}&room_name=${encodeURIComponent(form.room)}`,
          { method: "POST" }
        ).catch(() => {}); // non-blocking, best-effort
      }

      if (tenantEmail) {
        sendInviteEmail(form.name, tenantEmail, form.phone);
      }

      setForm({ name: "", room: "", phone: "", email: "" });
      setOpen(false);
      toast.success(`${form.name} added`);
    } catch {
      toast.error("Failed to add tenant");
    }
  }

  async function del(t: Tenant) {
    try {
      await remove(t.id);
      toast.success(`${t.name} removed`);
    } catch {
      toast.error("Failed to remove tenant");
    }
  }

  function handleSelectPlan(planId: string) {
    setStep("details");
  }

  return (
    <DashboardShell
      title="Tenants"
      subtitle="All active residents across your property"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total tenants" value={String(items.length)} icon={Users} />
        <KpiCard
          label="Occupied rooms"
          value={String(new Set(items.map((t) => t.room)).size)}
          tone="up"
          icon={Users}
        />
        <KpiCard
          label="Total rooms"
          value={String(allRooms.length)}
          tone="neutral"
          icon={Users}
        />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants…"
              className="pl-8 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
          <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => {
                const roomInfo = roomMap.get(t.room);
                const isInactive = t.status === "inactive";
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{t.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground dark:text-[#F8FAFC]">{t.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{t.room || "—"}</TableCell>
                    <TableCell className="text-muted-foreground dark:text-[#A8B4C5]">
                      {roomInfo?.floor ? `${roomInfo.floor} Floor` : "Ground Floor"}
                    </TableCell>
                    <TableCell className="text-muted-foreground dark:text-[#A8B4C5]">
                      {roomInfo?.type || "Standard"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isInactive ? "warning" : "success"} className="capitalize">
                        {isInactive ? "Inactive" : "Active"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
               <TableRow>
                 <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                   No tenants match.
                 </TableCell>
               </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
      </section>

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
                <span className="font-medium">Room {view.room}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Floor & Type:</span>{" "}
                <span className="font-medium">
                  {roomMap.get(view.room)?.floor ? `${roomMap.get(view.room)?.floor} Floor` : "Floor —"} · {roomMap.get(view.room)?.type || "Standard"}
                </span>
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
                <Badge variant={RENT[view.rent]} className="capitalize">
                  {view.rent}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">KYC:</span>{" "}
                <Badge variant={KYC[view.kyc]} className="capitalize">
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
