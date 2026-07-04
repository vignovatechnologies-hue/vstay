import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { WashingMachine, CalendarDays, Clock, Package, Check } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tenant/laundry")({
  head: () => ({ meta: [{ title: "Laundry booking · Hostly" }] }),
  component: LaundryPage,
});

const SLOTS = [
  { time: "07:00 – 08:30", available: true },
  { time: "08:30 – 10:00", available: false },
  { time: "10:00 – 11:30", available: true },
  { time: "11:30 – 13:00", available: true },
  { time: "14:00 – 15:30", available: false },
  { time: "15:30 – 17:00", available: true },
  { time: "17:00 – 18:30", available: true },
  { time: "18:30 – 20:00", available: true },
];

const NEXT_DAYS = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    key: d.toISOString().slice(0, 10),
    day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.getDate(),
    label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
  };
});

type Booking = {
  id: string;
  date: string;
  slot: string;
  service: string;
  machine: string;
  status: "upcoming" | "completed";
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "L-2411",
    date: "28 Nov 2026",
    slot: "10:00 – 11:30",
    service: "Wash & dry",
    machine: "Machine 2",
    status: "completed",
  },
  {
    id: "L-2420",
    date: "02 Dec 2026",
    slot: "17:00 – 18:30",
    service: "Wash & dry",
    machine: "Machine 1",
    status: "upcoming",
  },
];

function LaundryPage() {
  const { user } = useAuth();
  const [dayKey, setDayKey] = useState(NEXT_DAYS[0].key);
  const [slot, setSlot] = useState<string | null>(null);
  const [service, setService] = useState("wash_dry");
  const [loadKg, setLoadKg] = useState("3");
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  const day = NEXT_DAYS.find((d) => d.key === dayKey)!;

  function confirm() {
    if (!slot) {
      toast.error("Pick a time slot first");
      return;
    }
    const b: Booking = {
      id: `L-${Math.floor(Math.random() * 900 + 100)}`,
      date: day.label,
      slot,
      service:
        service === "wash_dry" ? "Wash & dry" : service === "wash" ? "Wash only" : "Iron & fold",
      machine: `Machine ${Math.floor(Math.random() * 3) + 1}`,
      status: "upcoming",
    };
    setBookings([b, ...bookings]);
    setSlot(null);
    toast.success(`Slot booked for ${day.label}, ${b.slot}`);
  }

  return (
    <DashboardShell
      title="Laundry"
      subtitle="Book a machine slot in the common laundry room"
      navGroups={TENANT_NAV}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4" /> Choose a day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {NEXT_DAYS.map((d) => {
                const active = d.key === dayKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => {
                      setDayKey(d.key);
                      setSlot(null);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-md border py-2 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 bg-background hover:bg-accent",
                    )}
                  >
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                      {d.day}
                    </span>
                    <span className="text-lg font-semibold leading-none">{d.date}</span>
                  </button>
                );
              })}
            </div>

            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Available slots · {day.label}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SLOTS.map((s) => {
                const active = slot === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => setSlot(s.time)}
                    className={cn(
                      "rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                      !s.available &&
                        "cursor-not-allowed border-dashed border-border/70 bg-muted/50 text-muted-foreground line-through",
                      s.available &&
                        !active &&
                        "border-border/70 bg-background hover:border-primary/50 hover:bg-accent",
                      active && "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    {s.time}
                    {!s.available ? <span className="ml-1 text-[10px]">Booked</span> : null}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" /> Booking details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wash">Wash only</SelectItem>
                  <SelectItem value="wash_dry">Wash & dry</SelectItem>
                  <SelectItem value="iron">Iron & fold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kg">Load (kg)</Label>
              <Input
                id="kg"
                type="number"
                min="1"
                max="8"
                value={loadKg}
                onChange={(e) => setLoadKg(e.target.value)}
              />
            </div>
            <div className="rounded-md border border-border/70 bg-muted/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Day</span>
                <span className="font-medium">{day.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slot</span>
                <span className="font-medium">{slot ?? "—"}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-border/70 pt-2">
                <span className="text-muted-foreground">Charge</span>
                <span className="font-semibold">Included</span>
              </div>
            </div>
            <Button className="w-full" onClick={confirm} disabled={!slot}>
              <Check className="mr-1 h-4 w-4" /> Confirm booking
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <WashingMachine className="h-4 w-4" /> Your bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-md border border-border/70 p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {b.date} · {b.slot}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono">{b.id}</span> · {b.service} · {b.machine}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  b.status === "upcoming" ? "bg-info/10 text-info" : "bg-success/10 text-success",
                )}
              >
                {b.status === "upcoming" ? "Upcoming" : "Completed"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
