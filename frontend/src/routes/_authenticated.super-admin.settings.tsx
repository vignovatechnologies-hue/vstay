import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Shield, Bell, Key, User } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_authenticated/super-admin/settings")({
  head: () => ({ meta: [{ title: "Platform settings · Hostly" }] }),
  component: PlatformSettings,
});

type S = {
  brand: { name: string; support: string; currency: string; tz: string; marketing: string };
  security: { admin2fa: boolean; owner2fa: boolean; ipAllow: boolean; sessionExpiry: boolean };
  notif: { signups: boolean; failed: boolean; incidents: boolean; digest: boolean };
};
const DEFAULTS: S = {
  brand: {
    name: "Hostly",
    support: "support@hostly.app",
    currency: "INR (₹)",
    tz: "Asia/Kolkata",
    marketing: "https://hostly.app",
  },
  security: { admin2fa: true, owner2fa: false, ipAllow: false, sessionExpiry: true },
  notif: { signups: true, failed: true, incidents: true, digest: true },
};

function PlatformSettings() {
  const { user } = useAuth();
  const [s, setS] = useLocalState<S>("hostly.sa.settings", DEFAULTS);
  const [draft, setDraft] = useState(s.brand);
  const [keysOpen, setKeysOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  function saveBrand() {
    setS({ ...s, brand: draft });
    toast.success("Platform settings saved");
  }
  const updSec = <K extends keyof S["security"]>(k: K, v: boolean) => {
    setS({ ...s, security: { ...s.security, [k]: v } });
    toast.success("Security updated");
  };
  const updNotif = <K extends keyof S["notif"]>(k: K, v: boolean) => {
    setS({ ...s, notif: { ...s.notif, [k]: v } });
    toast.success("Notifications updated");
  };

  return (
    <DashboardShell
      title="Platform settings"
      subtitle="Global configuration for Hostly"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Brand & workspace defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Platform name"
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
              <Field
                label="Support email"
                value={draft.support}
                onChange={(v) => setDraft({ ...draft, support: v })}
              />
              <Field
                label="Default currency"
                value={draft.currency}
                onChange={(v) => setDraft({ ...draft, currency: v })}
              />
              <Field
                label="Default timezone"
                value={draft.tz}
                onChange={(v) => setDraft({ ...draft, tz: v })}
              />
            </div>
            <div>
              <Label>Marketing site URL</Label>
              <Input
                value={draft.marketing}
                onChange={(e) => setDraft({ ...draft, marketing: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={saveBrand}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row label="Role" value="Super Admin" />
            <Separator />
            <Button variant="outline" size="sm" className="w-full" onClick={() => setPwOpen(true)}>
              Change password
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              label="Enforce 2FA for all admins"
              checked={s.security.admin2fa}
              onChange={(v) => updSec("admin2fa", v)}
            />
            <Toggle
              label="Enforce 2FA for owners"
              checked={s.security.owner2fa}
              onChange={(v) => updSec("owner2fa", v)}
            />
            <Toggle
              label="IP allowlist for admin panel"
              checked={s.security.ipAllow}
              onChange={(v) => updSec("ipAllow", v)}
            />
            <Toggle
              label="Session auto-expire · 30 min"
              checked={s.security.sessionExpiry}
              onChange={(v) => updSec("sessionExpiry", v)}
            />
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
              label="New owner signups"
              checked={s.notif.signups}
              onChange={(v) => updNotif("signups", v)}
            />
            <Toggle
              label="Failed payments"
              checked={s.notif.failed}
              onChange={(v) => updNotif("failed", v)}
            />
            <Toggle
              label="Security incidents"
              checked={s.notif.incidents}
              onChange={(v) => updNotif("incidents", v)}
            />
            <Toggle
              label="Weekly platform digest"
              checked={s.notif.digest}
              onChange={(v) => updNotif("digest", v)}
            />
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="h-4 w-4" /> API & integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Payments" value="Razorpay · Live" />
            <Row label="SMS" value="MSG91" />
            <Row label="Email" value="Postmark" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">API status</span>
              <Badge variant="success" className="font-bold border-2 shadow-sm">
                Operational
              </Badge>
            </div>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setKeysOpen(true)}
            >
              Manage API keys
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={keysOpen} onOpenChange={setKeysOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API keys</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {["pk_live_hostly_84af…c1e2", "sk_live_hostly_2b91…f60a"].map((k) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-md border border-border-default p-3 font-mono text-xs"
              >
                <span>{k}</span>
                <div className="space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard?.writeText(k);
                      toast.success("Copied");
                    }}
                  >
                    Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Key rotated")}>
                    Rotate
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => toast.success("New key created")}>Create key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Current password</Label>
              <Input type="password" className="mt-1.5" />
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPwOpen(false);
                toast.success("Password updated");
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
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
