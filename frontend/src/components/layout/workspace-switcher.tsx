import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/providers/workspace-provider";
import { cn } from "@/lib/utils";

const ACCENT: Record<string, string> = {
  blue: "bg-info/15 text-info",
  violet:
    "bg-[oklch(0.93_0.05_300)] text-[oklch(0.45_0.18_300)] dark:bg-[oklch(0.3_0.08_300)] dark:text-[oklch(0.85_0.12_300)]",
  amber: "bg-warning/20 text-warning-foreground",
  emerald: "bg-success/15 text-success",
  rose: "bg-destructive/10 text-destructive",
};

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  if (workspaces.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 justify-between gap-2 px-2.5 text-sm">
          <span className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded text-[11px] font-semibold",
                ACCENT[activeWorkspace?.accent ?? "blue"],
              )}
              aria-hidden
            >
              {activeWorkspace?.initials ?? <Building2 className="h-3.5 w-3.5" />}
            </span>
            <span className="truncate font-medium">
              {activeWorkspace?.name ?? "Select workspace"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Your workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => {
          const active = activeWorkspace?.id === w.id;
          return (
            <DropdownMenuItem
              key={w.id}
              onClick={() => switchWorkspace(w.id)}
              className="gap-3 py-2"
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded text-xs font-semibold",
                  ACCENT[w.accent],
                )}
                aria-hidden
              >
                {w.initials}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{w.name}</span>
                <span className="truncate text-xs text-muted-foreground">{w.city}</span>
              </span>
              {active ? <Check className="ml-auto h-4 w-4 text-primary" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
