import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { useAuth } from "@/providers/auth-provider";

interface TopbarProps {
  title: string;
  subtitle?: string;
  showWorkspaceSwitcher?: boolean;
}

export function Topbar({ title, subtitle, showWorkspaceSwitcher = false }: TopbarProps) {
  const { hasRole } = useAuth();
  const showSwitcher = showWorkspaceSwitcher && hasRole("owner");

  return (
    <header className="z-30 shrink-0 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold leading-tight text-foreground">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {showSwitcher ? <WorkspaceSwitcher /> : null}
      <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
