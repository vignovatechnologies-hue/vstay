import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Bell, CreditCard, Shield, User, Layers, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";
import { useLocalState } from "@/lib/local-store";
import { useRoomConfig, DEFAULT_FLOORS, DEFAULT_ROOM_TYPES } from "@/lib/room-config";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/owner/settings")({
  head: () => ({ meta: [{ title: "Settings · Hostly" }] }),
  component: SettingsPage,
});

type OwnerSettings = {
  property: { name: string; gst: string; phone: string; email: string; address: string };
  notif: { rent: boolean; complaint: boolean; movement: boolean; digest: boolean };
  security: { twofa: boolean; loginAlerts: boolean; autoSignOut: boolean };
};
const DEFAULTS: OwnerSettings = {
  property: {
    name: "Lotus Ladies PG",
    gst: "27AABCU9603R1ZM",
    phone: "+91 98765 22110",
    email: "single@hostly.app",
    address: "21, Linking Road, Bandra West, Mumbai 400050",
  },
  notif: { rent: true, complaint: true, movement: true, digest: false },
  security: { twofa: true, loginAlerts: true, autoSignOut: false },
};

function SettingsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [settings, setSettings] = useLocalState<OwnerSettings>("hostly.owner.settings", DEFAULTS);
  const [roomConfig, setRoomConfig] = useRoomConfig();
  const [draft, setDraft] = useState(settings.property);
  const [pwOpen, setPwOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [sesOpen, setSesOpen] = useState(false);
  const [newFloor, setNewFloor] = useState("");
  const [newType, setNewType] = useState("");

  const activePlanId = activeWorkspace?.planId || "monthly";
  const planName = activePlanId === "yearly" ? "Yearly Plan" : "Monthly Plan";
  const planPrice = activePlanId === "yearly" ? "₹ 9,999/yr" : "₹ 999/mo";
  const bedsCount = activeWorkspace?.totalBeds || (activePlanId === "yearly" ? 60 : 50);

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function saveProperty() {
    setSettings({ ...settings, property: draft });
    toast.success("Property details saved");
  }
  function updateNotif<K extends keyof OwnerSettings["notif"]>(k: K, v: boolean) {
    setSettings({ ...settings, notif: { ...settings.notif, [k]: v } });
    toast.success(`Notification updated`);
  }
  function updateSec<K extends keyof OwnerSettings["security"]>(k: K, v: boolean) {
    setSettings({ ...settings, security: { ...settings.security, [k]: v } });
    toast.success(`Security setting updated`);
  }

  function addFloor() {
    const v = newFloor.trim();
    if (!v) return;
    if (roomConfig.floors.includes(v)) {
      toast.error("Floor already exists");
      return;
    }
    setRoomConfig({ ...roomConfig, floors: [...roomConfig.floors, v] });
    setNewFloor("");
    toast.success(`Floor "${v}" added`);
  }
  function removeFloor(f: string) {
    setRoomConfig({ ...roomConfig, floors: roomConfig.floors.filter((x) => x !== f) });
    toast.success(`Floor "${f}" removed`);
  }
  function addType() {
    const v = newType.trim();
    if (!v) return;
    if (roomConfig.types.includes(v)) {
      toast.error("Room type already exists");
      return;
    }
    setRoomConfig({ ...roomConfig, types: [...roomConfig.types, v] });
    setNewType("");
    toast.success(`Room type "${v}" added`);
  }
  function removeType(t: string) {
    setRoomConfig({ ...roomConfig, types: roomConfig.types.filter((x) => x !== t) });
    toast.success(`Room type "${t}" removed`);
  }
  function resetRoomConfig() {
    setRoomConfig({ floors: DEFAULT_FLOORS, types: DEFAULT_ROOM_TYPES });
    toast.success("Floors & room types reset to defaults");
  }

  return (
    <DashboardShell
      title="Settings"
      subtitle="Property, billing and preferences"
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Property details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Property name"
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
              <Field
                label="GST number"
                value={draft.gst}
                onChange={(v) => setDraft({ ...draft, gst: v })}
              />
              <Field
                label="Contact phone"
                value={draft.phone}
                onChange={(v) => setDraft({ ...draft, phone: v })}
              />
              <Field
                label="Contact email"
                value={draft.email}
                onChange={(v) => setDraft({ ...draft, email: v })}
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={saveProperty}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row label="Role" value="Owner" />
            <Separator />
            <Button variant="outline" size="sm" className="w-full" onClick={() => setPwOpen(true)}>
              Change password
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-3 border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" /> Floors & room types
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label>Floors</Label>
              <div className="flex flex-wrap gap-2">
                {roomConfig.floors.map((f) => (
                  <Badge key={f} variant="secondary" className="gap-1 pr-1">
                    {f}
                    <button
                      onClick={() => removeFloor(f)}
                      className="ml-1 rounded hover:bg-muted-foreground/10 p-0.5"
                      aria-label={`Remove ${f}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {roomConfig.floors.length === 0 && (
                  <span className="text-xs text-muted-foreground">No floors yet</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Sixth"
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFloor();
                    }
                  }}
                />
                <Button size="sm" onClick={addFloor}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Room types</Label>
              <div className="flex flex-wrap gap-2">
                {roomConfig.types.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 pr-1">
                    {t}
                    <button
                      onClick={() => removeType(t)}
                      className="ml-1 rounded hover:bg-muted-foreground/10 p-0.5"
                      aria-label={`Remove ${t}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {roomConfig.types.length === 0 && (
                  <span className="text-xs text-muted-foreground">No types yet</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Quad"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addType();
                    }
                  }}
                />
                <Button size="sm" onClick={addType}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetRoomConfig}>
                Reset to defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              label="Rent payment received"
              checked={settings.notif.rent}
              onChange={(v) => updateNotif("rent", v)}
            />
            <Toggle
              label="New complaint raised"
              checked={settings.notif.complaint}
              onChange={(v) => updateNotif("complaint", v)}
            />
            <Toggle
              label="Tenant move-in / move-out"
              checked={settings.notif.movement}
              onChange={(v) => updateNotif("movement", v)}
            />
            <Toggle
              label="Weekly reports digest"
              checked={settings.notif.digest}
              onChange={(v) => updateNotif("digest", v)}
            />
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" /> Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Plan" value={`${planName} · ${planPrice}`} />
            <Row label="Next invoice" value="15 Dec 2026" />
            <Row label="Payment method" value="•••• 4021" />
            <Separator />
            <Button variant="outline" size="sm" className="w-full" onClick={() => setSubOpen(true)}>
              Manage subscription
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              label="Two-factor authentication"
              checked={settings.security.twofa}
              onChange={(v) => updateSec("twofa", v)}
            />
            <Toggle
              label="Login alerts"
              checked={settings.security.loginAlerts}
              onChange={(v) => updateSec("loginAlerts", v)}
            />
            <Toggle
              label="Auto sign-out after 30 min"
              checked={settings.security.autoSignOut}
              onChange={(v) => updateSec("autoSignOut", v)}
            />
            <Button variant="outline" size="sm" className="w-full" onClick={() => setSesOpen(true)}>
              View active sessions
            </Button>
          </CardContent>
        </Card>
      </div>

      <PasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
      <Dialog open={subOpen} onOpenChange={setSubOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <Row label="Current plan" value={`${planName} · ${planPrice}`} />
            <Row label="Renews on" value="15 Dec 2026" />
            <Row label="Beds included" value={String(bedsCount)} />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                toast.success("Downgrade scheduled");
                setSubOpen(false);
              }}
            >
              Downgrade
            </Button>
            <Button
              onClick={() => {
                toast.success("Upgraded to Scale");
                setSubOpen(false);
              }}
            >
              Upgrade to Scale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={sesOpen} onOpenChange={setSesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Active sessions</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            {[
              { d: "Chrome · macOS", i: "This device", w: "Now" },
              { d: "Safari · iPhone", i: "Mumbai, IN", w: "2 hours ago" },
              { d: "Chrome · Windows", i: "Bengaluru, IN", w: "Yesterday" },
            ].map((s) => (
              <div
                key={s.d}
                className="flex justify-between rounded-md border border-border-default p-3"
              >
                <div>
                  <p className="font-medium">{s.d}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.i} · {s.w}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(`Signed out from ${s.d}`)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

function PasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [cur, setCur] = useState("");
  const [n, setN] = useState("");
  const [c, setC] = useState("");
  function submit() {
    if (!cur || !n) {
      toast.error("Fill all fields");
      return;
    }
    if (n.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (n !== c) {
      toast.error("Passwords don't match");
      return;
    }
    toast.success("Password updated");
    setCur("");
    setN("");
    setC("");
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Current password</Label>
            <Input
              type="password"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>New password</Label>
            <Input
              type="password"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Update password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
