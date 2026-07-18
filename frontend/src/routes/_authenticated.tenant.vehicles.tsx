import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { CarFront, Plus, Car, Trash2, Edit2, Info } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { formatShortDate } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/tenant/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles · Hostly" }] }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      action: (search.action as string) || undefined,
    };
  },
  component: TenantVehiclesPage,
});

type VehicleType = "Car" | "Motorcycle" | "Scooter" | "Bicycle" | "Other";
type VehicleStatus = "Verified" | "Pending" | "Rejected";

type Vehicle = {
  id: string;
  type: VehicleType;
  regNumber: string;
  make: string;
  model: string;
  color: string;
  parkingRequired: "Yes" | "No";
  parkingSlot?: string;
  status: VehicleStatus;
  notes?: string;
  addedAt: string;
};

const STATUS_VARIANTS: Record<VehicleStatus, "success" | "warning" | "destructive"> = {
  Verified: "success",
  Pending: "warning",
  Rejected: "destructive",
};

const INITIAL_FORM = {
  type: "Car" as VehicleType,
  regNumber: "",
  make: "",
  model: "",
  color: "",
  parkingRequired: "Yes" as "Yes" | "No",
  parkingSlot: "",
  notes: "",
};

function TenantVehiclesPage() {
  const { user } = useAuth();
  
  if (!user || user.role !== "tenant") {
    return <Navigate to="/unauthorized" />;
  }

  // Ensure robust data isolation using the tenant's user.id
  const { items: vehicles, add, update, remove } = useApiCollection<Vehicle>(
    "/api/vehicles",
    {
      params: { userId: user.id },
      enabled: !!user.id,
    }
  );

  const search = Route.useSearch();
  const navigate = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [view, setView] = useState<Vehicle | null>(null);
  const [edit, setEdit] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (search.action === "add-vehicle") {
      setOpenAdd(true);
      navigate({ to: "/tenant/vehicles", replace: true, search: { action: undefined } });
    }
  }, [search.action, navigate]);

  const twoWheelers = vehicles.filter((v) => v.type === "Motorcycle" || v.type === "Scooter" || v.type === "Bicycle").length;
  const fourWheelers = vehicles.filter((v) => v.type === "Car").length;
  const parkingSlots = vehicles.filter((v) => v.parkingRequired === "Yes" && v.parkingSlot).length;

  async function submitAdd() {
    if (!user) return;
    let normalizedReg = form.regNumber.trim().toUpperCase().replace(/\s+/g, " ");
    
    if (form.type !== "Bicycle" && !normalizedReg) {
      toast.error("Registration Number is required for motor vehicles.");
      return;
    }
    
    // Check for duplicates
    if (normalizedReg && vehicles.some((v) => v.regNumber === normalizedReg)) {
      toast.error("This registration number is already registered to your account.");
      return;
    }

    try {
      await add({
        userId: user.id,
        workspaceId: user.workspaceIds?.[0] || "",
        type: form.type,
        regNumber: normalizedReg,
        make: form.make.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
        parkingRequired: form.parkingRequired,
        parkingSlot: form.parkingRequired === "Yes" ? form.parkingSlot.trim() : "",
        status: "Pending", // New vehicles are pending by default
        notes: form.notes.trim(),
        addedAt: formatShortDate(),
      } as Omit<Vehicle, "id">);

      setForm(INITIAL_FORM);
      setOpenAdd(false);
      toast.success("Vehicle added and pending verification.");
    } catch {
      toast.error("Failed to add vehicle.");
    }
  }

  async function submitEdit() {
    if (!edit) return;
    
    let normalizedReg = form.regNumber.trim().toUpperCase().replace(/\s+/g, " ");
    
    if (form.type !== "Bicycle" && !normalizedReg) {
      toast.error("Registration Number is required for motor vehicles.");
      return;
    }

    // Check duplicate against other vehicles
    if (normalizedReg && vehicles.some((v) => v.id !== edit.id && v.regNumber === normalizedReg)) {
      toast.error("This registration number is already registered to your account.");
      return;
    }

    // If sensitive data changed, revert to Pending (mock business rule)
    let newStatus = edit.status;
    if (normalizedReg !== edit.regNumber || form.type !== edit.type) {
      newStatus = "Pending";
      toast.info("Vehicle details changed significantly. Status reverted to Pending.");
    }

    try {
      await update(edit.id, {
        type: form.type,
        regNumber: normalizedReg,
        make: form.make.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
        parkingRequired: form.parkingRequired,
        parkingSlot: form.parkingRequired === "Yes" ? form.parkingSlot.trim() : "",
        notes: form.notes.trim(),
        status: newStatus,
      });
      setEdit(null);
      toast.success("Vehicle updated successfully.");
    } catch {
      toast.error("Failed to update vehicle.");
    }
  }

  async function del(v: Vehicle) {
    if (window.confirm(`Remove vehicle? This will remove ${v.regNumber || v.make} from your registered vehicles.`)) {
      try {
        await remove(v.id);
        toast.success("Vehicle removed.");
      } catch {
        toast.error("Failed to remove vehicle.");
      }
    }
  }

  return (
    <DashboardShell
      title="My Vehicles"
      subtitle="Manage vehicles registered with your stay"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Registered Vehicles" value={String(vehicles.length)} icon={CarFront} />
        <KpiCard label="Two-Wheelers" value={String(twoWheelers)} icon={CarFront} tone="neutral" />
        <KpiCard label="Four-Wheelers" value={String(fourWheelers)} icon={CarFront} tone="neutral" />
        <KpiCard label="Parking Slots" value={String(parkingSlots)} icon={CarFront} tone="up" />
      </div>

      <section className="w-full mt-6 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Vehicles</h2>
        <Dialog open={openAdd} onOpenChange={(o) => {
          if (!o) setForm(INITIAL_FORM);
          setOpenAdd(o);
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Vehicle</DialogTitle>
              <DialogDescription>Register a new vehicle to your account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Vehicle Type *</Label>
                <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val as VehicleType })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Scooter">Scooter</SelectItem>
                    <SelectItem value="Bicycle">Bicycle</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Registration Number {form.type !== "Bicycle" && "*"}</Label>
                <Input
                  value={form.regNumber}
                  onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                  placeholder={form.type === "Bicycle" ? "Optional" : "e.g. TS 09 AB 1234"}
                  className="mt-1.5 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Make</Label>
                  <Input
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    placeholder="e.g. Honda"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="e.g. City"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Color</Label>
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="e.g. White"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Parking Required</Label>
                  <Select value={form.parkingRequired} onValueChange={(val) => setForm({ ...form, parkingRequired: val as "Yes" | "No" })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.parkingRequired === "Yes" && (
                <div>
                  <Label>Parking Slot (Optional)</Label>
                  <Input
                    value={form.parkingSlot}
                    onChange={(e) => setForm({ ...form, parkingSlot: e.target.value })}
                    placeholder="e.g. P-12"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave blank to request an unassigned slot.</p>
                </div>
              )}
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1.5 resize-none h-16"
                  placeholder="Any specific details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAdd(false)}>
                Cancel
              </Button>
              <Button onClick={submitAdd}>Add Vehicle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <div className="space-y-2">
        {vehicles.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent mt-8">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CarFront className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">No vehicles registered</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                Add a vehicle to keep your parking and entry details up to date.
              </p>
              <Button onClick={() => setOpenAdd(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-background/50 backdrop-blur-sm shadow-sm transition-colors hover:bg-surface-raised dark:bg-[#111C2E]/60 dark:border-slate-500/20 dark:hover:bg-blue-600/10"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2.5 dark:bg-primary/20 shrink-0">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-[#F1F5F9]">
                    {v.make && v.model ? `${v.make} ${v.model}` : v.type}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {v.regNumber && (
                      <span className="font-mono text-sm text-foreground/80 dark:text-[#F1F5F9] font-medium bg-secondary/50 px-1.5 py-0.5 rounded">
                        {v.regNumber}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground dark:text-[#A8B4C5]">
                      {v.color ? `${v.color} · ${v.type}` : v.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground dark:text-[#7F8EA3]">Parking</span>
                      <span className="text-xs font-semibold text-foreground/80 dark:text-[#A8B4C5]">
                        {v.parkingRequired === "Yes" ? (v.parkingSlot || "Unassigned") : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground dark:text-[#7F8EA3]">Status</span>
                      <Badge variant={STATUS_VARIANTS[v.status]} className="h-5 px-1.5 text-[10px] uppercase font-bold">
                        {v.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center sm:self-center self-end gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => setView(v)}>
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setForm({
                      type: v.type,
                      regNumber: v.regNumber,
                      make: v.make,
                      model: v.model,
                      color: v.color,
                      parkingRequired: v.parkingRequired,
                      parkingSlot: v.parkingSlot || "",
                      notes: v.notes || "",
                    });
                    setEdit(v);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>Full registration information</DialogDescription>
          </DialogHeader>
          {view && (
            <div className="space-y-4 text-sm mt-2">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Vehicle Type</span>
                  <span className="font-medium">{view.type}</span>
                </div>
                {view.regNumber && (
                  <div>
                    <span className="text-muted-foreground block text-xs mb-1">Registration No.</span>
                    <span className="font-mono font-medium">{view.regNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Make / Model</span>
                  <span className="font-medium">{view.make || view.model ? `${view.make} ${view.model}` : "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Color</span>
                  <span className="font-medium">{view.color || "—"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Parking Slot</span>
                  <span className="font-medium">
                    {view.parkingRequired === "Yes" ? (view.parkingSlot || "Unassigned") : "Not Required"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs mb-1">Added On</span>
                  <span className="font-medium">{view.addedAt}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <span className="text-muted-foreground block text-xs mb-2">Verification Status</span>
                <Badge variant={STATUS_VARIANTS[view.status]} className="uppercase font-bold tracking-wider">
                  {view.status}
                </Badge>
                {view.status === "Pending" && (
                  <p className="text-xs text-muted-foreground mt-2 flex gap-1.5 items-start">
                    <Info className="h-4 w-4 shrink-0 text-amber-500" />
                    Pending verification by property management. You will be notified once verified.
                  </p>
                )}
              </div>

              {view.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground block text-xs mb-1">Notes</span>
                  <p className="font-medium text-sm whitespace-pre-wrap">{view.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="mt-4 flex sm:justify-between items-center">
            {view && (
              <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2" onClick={() => {
                const v = view;
                setView(null);
                setTimeout(() => del(v), 100);
              }}>
                <Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} /> Remove
              </Button>
            )}
            <Button onClick={() => setView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!edit} onOpenChange={(o) => {
        if (!o) setEdit(null);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update your vehicle information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div>
                <Label>Vehicle Type *</Label>
                <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val as VehicleType })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Scooter">Scooter</SelectItem>
                    <SelectItem value="Bicycle">Bicycle</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Registration Number {form.type !== "Bicycle" && "*"}</Label>
                <Input
                  value={form.regNumber}
                  onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
                  placeholder={form.type === "Bicycle" ? "Optional" : "e.g. TS 09 AB 1234"}
                  className="mt-1.5 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Make</Label>
                  <Input
                    value={form.make}
                    onChange={(e) => setForm({ ...form, make: e.target.value })}
                    placeholder="e.g. Honda"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="e.g. City"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Color</Label>
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="e.g. White"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Parking Required</Label>
                  <Select value={form.parkingRequired} onValueChange={(val) => setForm({ ...form, parkingRequired: val as "Yes" | "No" })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.parkingRequired === "Yes" && (
                <div>
                  <Label>Parking Slot (Optional)</Label>
                  <Input
                    value={form.parkingSlot}
                    onChange={(e) => setForm({ ...form, parkingSlot: e.target.value })}
                    placeholder="e.g. P-12"
                    className="mt-1.5"
                  />
                </div>
              )}
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1.5 resize-none h-16"
                  placeholder="Any specific details..."
                />
              </div>
            </div>
          <DialogFooter className="mt-4 flex sm:justify-between items-center">
            {edit && (
              <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2" onClick={() => {
                const v = edit;
                setEdit(null);
                setTimeout(() => del(v), 100);
              }}>
                <Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} /> Remove
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
              <Button onClick={submitEdit}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
