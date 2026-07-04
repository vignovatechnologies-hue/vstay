import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Plus, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiCard } from "@/components/layout/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";
import { useLocalCollection } from "@/lib/local-store";
import { shortId } from "@/lib/actions";

export const Route = createFileRoute("/_authenticated/super-admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements · Hostly" }] }),
  component: AnnouncementsPage,
});

type PStatus = "published" | "scheduled" | "draft";
type Post = {
  id: string;
  title: string;
  audience: string;
  author: string;
  when: string;
  status: PStatus;
  body: string;
};

const SEED: Post[] = [
  {
    id: "p1",
    title: "Scheduled maintenance · 08 Dec, 2–4 AM IST",
    audience: "All workspaces",
    author: "Aanya M.",
    when: "2 hours ago",
    status: "scheduled",
    body: "Rolling out payments infra upgrade.",
  },
  {
    id: "p2",
    title: "New: Laundry slot booking is live",
    audience: "Owners · Tenants",
    author: "Product team",
    when: "Yesterday",
    status: "published",
    body: "Tenants can now book laundry slots.",
  },
  {
    id: "p3",
    title: "GST rate change effective 1 Jan",
    audience: "Owners",
    author: "Finance",
    when: "3 days ago",
    status: "published",
    body: "Updated GST slabs from January onwards.",
  },
  {
    id: "p4",
    title: "Draft: Referral programme",
    audience: "Owners",
    author: "Aanya M.",
    when: "5 days ago",
    status: "draft",
    body: "One free month per referral.",
  },
];
const STATUS: Record<PStatus, string> = {
  published: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  draft: "bg-muted text-muted-foreground",
};

function AnnouncementsPage() {
  const { user } = useAuth();
  const { items, add, remove } = useLocalCollection<Post>("hostly.sa.posts", SEED);
  const [form, setForm] = useState({ title: "", audience: "All workspaces", body: "" });

  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  function submit(status: PStatus) {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and message are required");
      return;
    }
    add({
      id: shortId("p"),
      title: form.title,
      audience: form.audience,
      author: user!.fullName,
      when: "Just now",
      status,
      body: form.body,
    });
    setForm({ title: "", audience: "All workspaces", body: "" });
    toast.success(status === "published" ? "Announcement published" : "Draft saved");
  }

  return (
    <DashboardShell
      title="Announcements"
      subtitle="Broadcast updates to owners, staff and tenants"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Published"
          value={String(items.filter((p) => p.status === "published").length)}
          tone="up"
          icon={Megaphone}
        />
        <KpiCard
          label="Scheduled"
          value={String(items.filter((p) => p.status === "scheduled").length)}
          tone="neutral"
          icon={Bell}
        />
        <KpiCard
          label="Drafts"
          value={String(items.filter((p) => p.status === "draft").length)}
          tone="neutral"
          icon={Bell}
        />
        <KpiCard label="Avg. reach" value="94%" tone="up" icon={Megaphone} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Recent announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-md border border-border/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.audience} · by {p.author} · {p.when}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={STATUS[p.status]}>
                      {p.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        remove(p.id);
                        toast.success("Deleted");
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" /> New announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="e.g. New payments feature"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Audience</Label>
              <Input
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                rows={5}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write your announcement…"
                className="mt-1.5"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => submit("published")}>
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => submit("draft")}
              >
                Save draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
