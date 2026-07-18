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
import { useApiCollection } from "@/hooks/use-api-collection";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tenant/complaints")({
  head: () => ({ meta: [{ title: "Complaints · Hostly" }] }),
  component: ComplaintsPage,
});

type Status = "open" | "in_progress" | "resolved";

const STATUS_STYLE: Record<Status, { label: string; variant: "warning" | "info" | "success" }> = {
  open: { label: "Open", variant: "warning" },
  in_progress: { label: "In progress", variant: "info" },
  resolved: { label: "Resolved", variant: "success" },
};

function ComplaintsPage() {
  const { user } = useAuth();
  const { items, add } = useApiCollection<any>("/api/complaints", {
    params: { tenantName: user?.fullName },
    enabled: !!user?.fullName,
  });
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [desc, setDesc] = useState("");

  if (!user) return null;
  if (user.role !== "tenant") return <Navigate to="/unauthorized" />;

  async function submit() {
    if (!user) return;
    if (!title.trim()) return;
    try {
      await add({
        workspace_id: user.workspaceIds?.[0] || "pg_greenhaven",
        tenant: user.fullName,
        room: "—", // Default room if not available in user object
        category,
        title,
        description: desc || "Awaiting staff review.",
        raised_on: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "open",
      });
      setTitle("");
      setDesc("");
      setOpen(false);
      toast.success("Complaint submitted successfully");
    } catch {
      toast.error("Failed to submit complaint");
    }
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
            const s = STATUS_STYLE[c.status as Status] || STATUS_STYLE.open;
            return (
              <Card key={c.id} className="border-border-default">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{c.id}</span> · {c.category} · Filed {c.date}
                      </p>
                    </div>
                    <Badge variant={s.variant} className="font-bold border-2 shadow-sm">
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
