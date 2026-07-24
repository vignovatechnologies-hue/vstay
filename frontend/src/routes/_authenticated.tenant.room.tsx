import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { BedDouble, Users, Wifi, Snowflake, Bath, MapPin } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/tenant/room")({
  head: () => ({ meta: [{ title: "My room · Vstay" }] }),
  component: MyRoomPage,
});

const ROOMMATES = [
  { name: "Vikram Singh", bed: "Bed A", since: "Mar 2025", initials: "VS" },
  { name: "Arjun Kapoor", bed: "Bed B", since: "May 2025", initials: "AK", you: true },
  { name: "Nikhil Rao", bed: "Bed C", since: "Aug 2025", initials: "NR" },
];
const AMENITIES = [
  { icon: Wifi, label: "High-speed Wi-Fi" },
  { icon: Snowflake, label: "Air conditioning" },
  { icon: Bath, label: "Attached bathroom" },
  { icon: BedDouble, label: "Study desk & wardrobe" },
];

function MyRoomPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [pref, setPref] = useState("single");
  const [reason, setReason] = useState("");

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  function submit() {
    if (!reason.trim()) {
      toast.error("Add a short reason");
      return;
    }
    toast.success("Room change request submitted");
    setReason("");
    setOpen(false);
  }

  return (
    <DashboardShell
      title="My room"
      subtitle="Room 204 · Triple sharing · Second floor"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border-default">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Room 204 · Bed B</CardTitle>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> Greenhaven Residency, Indiranagar
                </p>
              </div>
              <Badge variant="success" className="font-bold border-2 shadow-sm">
                Occupied
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Floor" value="2nd" />
              <Stat label="Sharing" value="Triple" />
              <Stat label="Monthly rent" value="₹ 11,500" />
              <Stat label="Deposit" value="₹ 23,000" />
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amenities
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {AMENITIES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-md border border-border-default bg-surface-raised p-3 text-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Roommates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ROOMMATES.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{r.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {r.name}{" "}
                    {r.you ? <span className="text-xs text-muted-foreground">(you)</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.bed} · Since {r.since}
                  </p>
                </div>
              </div>
            ))}
            <Dialog open={open} onOpenChange={setOpen}>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
                Request room change
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request room change</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <div>
                    <Label>Preferred sharing</Label>
                    <Select value={pref} onValueChange={setPref}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="triple">Triple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reason</Label>
                    <Textarea
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Help us understand your request"
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submit}>Submit request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
