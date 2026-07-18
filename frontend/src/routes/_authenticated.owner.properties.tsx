import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, MapPin, Plus, BedDouble, Users, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { OWNER_NAV } from "@/config/navigation";

export const Route = createFileRoute("/_authenticated/owner/properties")({
  head: () => ({ meta: [{ title: "Properties · Hostly" }] }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const { user } = useAuth();
  const { workspaces, switchWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", address: "", beds: "" });

  if (!user) return null;
  if (user.role !== "owner") return <Navigate to="/unauthorized" />;

  function submit() {
    if (!form.name.trim() || !form.city.trim()) {
      toast.error("Name and city required");
      return;
    }
    toast.success(`${form.name} queued — activation email sent`);
    setForm({ name: "", city: "", address: "", beds: "" });
    setOpen(false);
  }

  return (
    <DashboardShell
      title="Properties"
      subtitle={`${workspaces.length} properties in your portfolio`}
      navGroups={OWNER_NAV}
      showWorkspaceSwitcher
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage buildings, floors and amenities</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add property</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Property name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Total beds</Label>
                  <Input
                    type="number"
                    value={form.beds}
                    onChange={(e) => setForm({ ...form, beds: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>Add property</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((w) => {
          const occ = Math.round((w.occupiedBeds / w.totalBeds) * 100);
          return (
            <Card key={w.id} className="border-border-default">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                      {w.initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{w.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {w.city}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          switchWorkspace(w.id);
                          navigate({ to: "/owner/dashboard" });
                        }}
                      >
                        Open dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          switchWorkspace(w.id);
                          navigate({ to: "/owner/rooms" });
                        }}
                      >
                        Manage rooms
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard?.writeText(w.address);
                          toast.success("Address copied");
                        }}
                      >
                        Copy address
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{w.address}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat icon={BedDouble} label="Beds" value={w.totalBeds.toString()} />
                  <Stat icon={Users} label="Occupied" value={w.occupiedBeds.toString()} />
                  <Stat icon={Building2} label="Occupancy" value={`${occ}%`} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="success" className="font-bold border-2 shadow-sm">
                    Active
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      switchWorkspace(w.id);
                      navigate({ to: "/owner/dashboard" });
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border-default bg-surface-raised p-2">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
