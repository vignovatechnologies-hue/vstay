import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "up" | "down";
  icon?: LucideIcon;
}

export function KpiCard({ label, value, delta, tone = "neutral", icon: Icon }: KpiCardProps) {
  return (
    <Card className="border-border-default shadow-[var(--shadow-elevation-1)]">
      <CardContent className="flex items-start gap-4 p-5">
        {Icon ? (
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {delta ? (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                tone === "up" && "text-success",
                tone === "down" && "text-destructive",
                tone === "neutral" && "text-muted-foreground",
              )}
            >
              {delta}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
