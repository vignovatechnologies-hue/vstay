import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Tag, Trash2, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { SUPER_ADMIN_NAV } from "@/config/navigation";
import { usePlansConfig, DEFAULT_PLANS, type Plan } from "@/lib/plans-config";

export const Route = createFileRoute("/_authenticated/super-admin/plans")({
  head: () => ({ meta: [{ title: "Plans & Pricing · Hostly" }] }),
  component: PlansPage,
});

function PlansPage() {
  const { user } = useAuth();
  const [config, setConfig] = usePlansConfig();

  if (!user) return null;
  if (user.role !== "super_admin") return <Navigate to="/unauthorized" />;

  function updatePlan(id: Plan["id"], patch: Partial<Plan>) {
    setConfig({ plans: config.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }
  function savePlan(p: Plan) {
    if (!p.name.trim() || !Number.isFinite(p.price) || p.price < 0) {
      toast.error("Enter a valid name and price");
      return;
    }
    toast.success(`${p.name} plan updated`);
  }
  function resetAll() {
    setConfig(DEFAULT_PLANS);
    toast.success("Plans reset to defaults");
  }

  return (
    <DashboardShell
      title="Plans & Pricing"
      subtitle="Edit subscription plans shown on the landing page"
      navGroups={SUPER_ADMIN_NAV}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Changes appear instantly on the home page pricing section.
        </p>
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw className="mr-1 h-4 w-4" /> Reset to defaults
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {config.plans.map((p) => (
          <PlanEditor
            key={p.id}
            plan={p}
            onChange={(patch) => updatePlan(p.id, patch)}
            onSave={() => savePlan(p)}
          />
        ))}
      </div>
    </DashboardShell>
  );
}

function PlanEditor({
  plan,
  onChange,
  onSave,
}: {
  plan: Plan;
  onChange: (patch: Partial<Plan>) => void;
  onSave: () => void;
}) {
  const [feature, setFeature] = useState("");

  function addFeature() {
    const v = feature.trim();
    if (!v) return;
    onChange({ features: [...plan.features, v] });
    setFeature("");
  }
  function removeFeature(i: number) {
    onChange({ features: plan.features.filter((_, idx) => idx !== i) });
  }

  return (
    <Card className={plan.highlighted ? "border-primary" : "border-border-default"}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tag className="h-4 w-4" /> {plan.name} plan
        </CardTitle>
        {plan.highlighted && <Badge>Highlighted</Badge>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Plan name</Label>
            <Input
              value={plan.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={plan.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Currency</Label>
            <Input
              value={plan.currency}
              onChange={(e) => onChange({ currency: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              min={0}
              value={plan.price}
              onChange={(e) => onChange({ price: Number(e.target.value) })}
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Period label</Label>
            <Input
              value={plan.period}
              placeholder="/month"
              onChange={(e) => onChange({ period: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border border-border-default bg-surface-raised p-3">
          <div>
            <p className="text-sm font-medium">Highlight this plan</p>
            <p className="text-xs text-muted-foreground">
              Displays a "Best value" badge on the landing page
            </p>
          </div>
          <Switch
            checked={!!plan.highlighted}
            onCheckedChange={(v) => onChange({ highlighted: v })}
          />
        </div>

        <Separator />

        <div>
          <Label>Features</Label>
          <ul className="mt-2 space-y-2">
            {plan.features.map((f, i) => (
              <li
                key={`${f}-${i}`}
                className="flex items-center justify-between rounded-md border border-border-default bg-surface-raised px-3 py-2 text-sm text-[#0F172A] dark:text-[#F8FAFC] hover:bg-surface-hover hover:border-border-strong transition-colors"
              >
                <span>{f}</span>
                <Button variant="ghost" size="icon" onClick={() => removeFeature(i)} className="text-[#94A3B8] dark:text-[#B7C4D4] hover:text-red-500 dark:hover:text-[#F87171] hover:bg-transparent">
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {plan.features.length === 0 && (
              <li className="text-xs text-muted-foreground">No features yet.</li>
            )}
          </ul>
          <div className="mt-2 flex gap-2">
            <Input
              placeholder="Add a feature…"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button size="sm" onClick={addFeature}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={onSave}>
            Save plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// keeps unused import lint happy for icon variants used above
void Trash2;
