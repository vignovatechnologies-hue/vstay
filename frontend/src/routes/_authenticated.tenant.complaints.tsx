import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MessagesSquare } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { TENANT_NAV } from "@/config/navigation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tenant/complaints")({
  head: () => ({ meta: [{ title: "Complaints · Hostly" }] }),
  component: ComplaintsPage,
});

type Status = "open" | "in_progress" | "resolved";

const INITIAL = [
  {
    id: "C-108",
    title: "AC not cooling properly",
    category: "Maintenance",
    date: "28 Nov 2026",
    status: "in_progress" as Status,
    note: "Technician assigned — visit scheduled tomorrow.",
  },
  {
    id: "C-092",
    title: "Wi-Fi disconnects in the evening",
    category: "Internet",
    date: "12 Nov 2026",
    status: "resolved" as Status,
    note: "Router replaced. Please report if issue recurs.",
  },
  {
    id: "C-081",
    title: "Leaking tap in bathroom",
    category: "Plumbing",
    date: "02 Nov 2026",
    status: "resolved" as Status,
    note: "Fixed by in-house plumber.",
  },
];

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-warning/10 text-warning" },
  in_progress: { label: "In progress", className: "bg-info/10 text-info" },
  resolved: { label: "Resolved", className: "bg-success/10 text-success" },
};

function ComplaintsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(INITIAL);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [desc, setDesc] = useState("");

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  function submit() {
    if (!title.trim()) return;
    const next = {
      id: `C-${Math.floor(Math.random() * 900 + 100)}`,
      title,
      category,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "open" as Status,
      note: desc || "Awaiting staff review.",
    };
    setItems([next, ...items]);
    setTitle("");
    setDesc("");
    setOpen(false);
  }

  return (
    <DashboardShell
      title="Complaints"
      subtitle="Raise and track issues with your stay"
      navGroups={TENANT_NAV}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} total · {items.filter((i) => i.status !== "resolved").length} active
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> New complaint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise a new complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ct">Title</Label>
                <Input
                  id="ct"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short summary of the issue"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Maintenance",
                      "Plumbing",
                      "Electrical",
                      "Internet",
                      "Housekeeping",
                      "Food",
                      "Security",
                      "Other",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cd">Description</Label>
                <Textarea
                  id="cd"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  placeholder="Add any details that help staff resolve this faster."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <MessagesSquare className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No complaints yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const s = STATUS_STYLE[c.status];
            return (
              <Card key={c.id} className="border-border/70">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{c.id}</span> · {c.category} · Filed {c.date}
                      </p>
                    </div>
                    <Badge variant="secondary" className={cn(s.className)}>
                      {s.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{c.note}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
