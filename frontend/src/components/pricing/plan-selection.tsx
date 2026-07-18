import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlansConfig } from "@/lib/plans-config";

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  onCancel?: () => void;
}

export function PlanSelection({ onSelectPlan, onCancel }: PlanSelectionProps) {
  const [{ plans }] = usePlansConfig();

  return (
    <div className="mx-auto max-w-3xl w-full">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Choose your plan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select the plan that fits your PG the best to continue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <Card
            key={p.id}
            className={p.highlighted ? "border-primary shadow-lg relative" : "border-border-default"}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {p.highlighted && <Badge>Best value</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {p.currency}
                  {p.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" /> <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => onSelectPlan(p.id)}
                className="mt-6 w-full"
                variant={p.highlighted ? "default" : "outline"}
              >
                Select {p.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {onCancel && (
        <div className="mt-6 flex justify-center md:justify-start">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
