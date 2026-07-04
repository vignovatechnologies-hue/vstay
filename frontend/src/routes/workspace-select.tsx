import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, MapPin, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspace } from "@/providers/workspace-provider";
import { ROLE_HOME } from "@/config/roles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace-select")({
  ssr: false,
  head: () => ({ meta: [{ title: "Choose a workspace · Hostly" }] }),
  component: WorkspaceSelectPage,
});

const ACCENT: Record<string, string> = {
  blue: "bg-info/15 text-info",
  violet:
    "bg-[oklch(0.93_0.05_300)] text-[oklch(0.45_0.18_300)] dark:bg-[oklch(0.3_0.08_300)] dark:text-[oklch(0.85_0.12_300)]",
  amber: "bg-warning/20 text-warning-foreground",
  emerald: "bg-success/15 text-success",
  rose: "bg-destructive/10 text-destructive",
};

function WorkspaceSelectPage() {
  const navigate = useNavigate();
  const { user, status, logout, setActiveWorkspace } = useAuth();
  const { workspaces, isLoading } = useWorkspace();

  if (status === "unauthenticated") return <Navigate to="/login" />;
  if (user && user.role !== "owner") return <Navigate to={ROLE_HOME[user.role]} />;

  function choose(workspaceId: string) {
    setActiveWorkspace(workspaceId);
    navigate({ to: "/owner/dashboard" });
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-4 md:px-8">
        <Logo />
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await logout();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Welcome back, {user?.fullName.split(" ")[0]}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Choose a workspace to continue
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You manage {workspaces.length} properties. Pick one to open its dashboard. You can
            switch anytime from the top bar.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-md bg-muted/60" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {workspaces.map((w, i) => {
              const occupancy = Math.round((w.occupiedBeds / w.totalBeds) * 100);
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => choose(w.id)}
                    className="group w-full text-left outline-none"
                  >
                    <Card className="border-border/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevation-3)] group-focus-visible:ring-2 group-focus-visible:ring-ring">
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            "grid h-12 w-12 shrink-0 place-items-center rounded-md text-sm font-semibold",
                            ACCENT[w.accent],
                          )}
                          aria-hidden
                        >
                          {w.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="truncate text-base font-semibold text-foreground">
                                {w.name}
                              </h2>
                              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" /> {w.city}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                            <Stat label="Total beds" value={w.totalBeds.toString()} />
                            <Stat label="Occupied" value={w.occupiedBeds.toString()} />
                            <Stat label="Occupancy" value={`${occupancy}%`} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && workspaces.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-12 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <h2 className="text-base font-semibold">No workspaces yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              You don&apos;t have any PG properties yet. Create one to get started.
            </p>
          </Card>
        ) : null}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border/60 bg-muted/30 px-2 py-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
