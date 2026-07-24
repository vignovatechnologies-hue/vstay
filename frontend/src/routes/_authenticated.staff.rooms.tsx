import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BedDouble, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useWorkspace } from "@/providers/workspace-provider";
import { STAFF_NAV } from "@/config/navigation";
import { isStaffRole, ROLE_LABEL } from "@/config/roles";
import { KpiCard } from "@/components/layout/kpi-card";
import { useApiCollection } from "@/hooks/use-api-collection";
import { AC_OPTIONS, useRoomConfig, type AcOption } from "@/lib/room-config";

export const Route = createFileRoute("/_authenticated/staff/rooms")({
  head: () => ({ meta: [{ title: "Rooms & Beds · Vstay" }] }),
  component: StaffRoomsPage,
});

type Status = "occupied" | "partial" | "vacant" | "maintenance";
type Room = {
  id: string;
  room: string;
  floor: string;
  type: string;
  rent: string;
  beds: string;
  status: Status;
};

const SEED: Room[] = [
  {
    id: "r-101",
    room: "101",
    floor: "Ground",
    type: "Single AC",
    rent: "₹ 16,500",
    beds: "1/1",
    status: "occupied",
  },
  {
    id: "r-102",
    room: "102",
    floor: "Ground",
    type: "Double AC",
    rent: "₹ 12,000",
    beds: "2/2",
    status: "occupied",
  },
  {
    id: "r-103",
    room: "103",
    floor: "Ground",
    type: "Double AC",
    rent: "₹ 12,000",
    beds: "1/2",
    status: "partial",
  },
  {
    id: "r-201",
    room: "201",
    floor: "1st",
    type: "Triple",
    rent: "₹ 9,500",
    beds: "3/3",
    status: "occupied",
  },
  {
    id: "r-202",
    room: "202",
    floor: "1st",
    type: "Triple",
    rent: "₹ 9,500",
    beds: "0/3",
    status: "vacant",
  },
  {
    id: "r-203",
    room: "203",
    floor: "1st",
    type: "Double AC",
    rent: "₹ 12,000",
    beds: "2/2",
    status: "occupied",
  },
  {
    id: "r-204",
    room: "204",
    floor: "2nd",
    type: "Triple AC",
    rent: "₹ 11,500",
    beds: "3/3",
    status: "occupied",
  },
  {
    id: "r-205",
    room: "205",
    floor: "2nd",
    type: "Single",
    rent: "₹ 14,000",
    beds: "0/1",
    status: "maintenance",
  },
  {
    id: "r-301",
    room: "301",
    floor: "3rd",
    type: "Double",
    rent: "₹ 10,500",
    beds: "2/2",
    status: "occupied",
  },
  {
    id: "r-302",
    room: "302",
    floor: "3rd",
    type: "Triple AC",
    rent: "₹ 11,500",
    beds: "1/3",
    status: "partial",
  },
];

const STATUS: Record<Status, "success" | "warning" | "info" | "danger"> = {
  occupied: "success",
  partial: "warning",
  vacant: "info",
  maintenance: "danger",
};

function StaffRoomsPage() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { items, add, update, remove } = useApiCollection<Room>("/api/rooms", {
    params: { workspaceId: activeWorkspace?.id },
    enabled: !!activeWorkspace?.id,
  });
  const [config] = useRoomConfig();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<Omit<Room, "id"> & { baseType: string; ac: AcOption }>({
    room: "",
    floor: "Ground",
    type: "Single",
    baseType: "Single",
    ac: "Non-AC",
    rent: "",
    beds: "0/1",
    status: "vacant",
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((r) => `${r.room} ${r.floor} ${r.type}`.toLowerCase().includes(s));
  }, [items, q]);

  const totalBeds = items.reduce((n, r) => n + Number(r.beds.split("/")[1] || 0), 0);
  const occupied = items.reduce((n, r) => n + Number(r.beds.split("/")[0] || 0), 0);
  const vacantRooms = items.filter((r) => r.status === "vacant").length;
  const maintenance = items.filter((r) => r.status === "maintenance").length;

  if (!user) return null;
  if (!isStaffRole(user.role)) return <Navigate to="/unauthorized" />;

  function openAdd() {
    setEditing(null);
    const baseType = config.types[0] ?? "Single";
    const floor = config.floors[0] ?? "Ground";
    setForm({
      room: "",
      floor,
      type: baseType,
      baseType,
      ac: "Non-AC",
      rent: "",
      beds: "0/1",
      status: "vacant",
    });
    setOpen(true);
  }
  function openEdit(r: Room) {
    setEditing(r);
    const isAc = / AC$/i.test(r.type);
    const baseType = r.type.replace(/\s*AC$/i, "").trim() || (config.types[0] ?? "Single");
    setForm({
      room: r.room,
      floor: r.floor,
      type: r.type,
      baseType,
      ac: isAc ? "AC" : "Non-AC",
      rent: r.rent,
      beds: r.beds,
      status: r.status,
    });
    setOpen(true);
  }
  async function save() {
    if (!form.room.trim() || !form.rent.trim()) {
      toast.error("Room number and rent are required");
      return;
    }
    const type = form.ac === "AC" ? `${form.baseType} AC` : form.baseType;
    const payload = {
      workspace_id: activeWorkspace?.id ?? "",
      room: form.room,
      floor: form.floor,
      type,
      rent: form.rent,
      beds: form.beds,
      status: form.status,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success(`Room ${form.room} updated`);
      } else {
        await add(payload as Omit<Room, "id">);
        toast.success(`Room ${form.room} added`);
      }
      setOpen(false);
    } catch {
      toast.error("Failed to save room");
    }
  }
  async function del(r: Room) {
    try {
      await remove(r.id);
      toast.success(`Room ${r.room} removed`);
    } catch {
      toast.error("Failed to remove room");
    }
  }

  return (
    <DashboardShell
      title="Rooms & Beds"
      subtitle="Inventory across floors and sharing types"
      navGroups={STAFF_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total rooms" value={String(items.length)} icon={BedDouble} />
        <KpiCard label="Total beds" value={String(totalBeds)} icon={BedDouble} />
        <KpiCard
          label="Occupied"
          value={String(occupied)}
          delta={totalBeds ? `${Math.round((occupied / totalBeds) * 100)}%` : "0%"}
          tone="up"
          icon={BedDouble}
        />
        <KpiCard
          label="Vacant"
          value={String(vacantRooms)}
          delta={`${maintenance} in maintenance`}
          tone="neutral"
          icon={BedDouble}
        />
      </div>

      <section className="w-full mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms…"
                className="pl-8 bg-input/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openAdd}>
                  <Plus className="mr-1 h-4 w-4" /> Add room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit room" : "Add room"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Room number</Label>
                    <Input
                      value={form.room}
                      onChange={(e) => setForm({ ...form, room: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Floor</Label>
                    <Select
                      value={form.floor}
                      onValueChange={(v) => setForm({ ...form, floor: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {config.floors.map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={form.baseType}
                        onValueChange={(v) => setForm({ ...form, baseType: v })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {config.types.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>AC / Non-AC</Label>
                      <Select
                        value={form.ac}
                        onValueChange={(v) => setForm({ ...form, ac: v as AcOption })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AC_OPTIONS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Rent</Label>
                    <Input
                      value={form.rent}
                      placeholder="₹ 12,000"
                      onChange={(e) => setForm({ ...form, rent: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Beds (occupied/total)</Label>
                    <Input
                      value={form.beds}
                      onChange={(e) => setForm({ ...form, beds: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => setForm({ ...form, status: v as Status })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["occupied", "partial", "vacant", "maintenance"] as Status[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={save}>{editing ? "Save changes" : "Add room"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Beds</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC]">{r.room}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#94A3B8] font-medium">{r.floor}</TableCell>
                  <TableCell className="text-muted-foreground dark:text-[#A8B4C5] font-medium">{r.type}</TableCell>
                  <TableCell className="font-semibold text-foreground dark:text-[#F8FAFC] tabular-nums">{r.rent}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground dark:text-[#A8B4C5]">{r.beds}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS[r.status]} className="capitalize">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="tableActionPrimary" size="sm" onClick={() => openEdit(r)}>
                      Edit
                    </Button>
                    <Button variant="tableActionDestructive" size="icon" onClick={() => del(r)}>
                      <Trash2 className="h-4 w-4 text-destructive dark:text-destructive-foreground" strokeWidth={2.5} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                    No rooms match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
      </section>
    </DashboardShell>
  );
}
