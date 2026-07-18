import type { ReactNode } from "react";
import { Sidebar, type NavGroup } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  navGroups: NavGroup[];
  showWorkspaceSwitcher?: boolean;
  children: ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  navGroups,
  showWorkspaceSwitcher,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar groups={navGroups} />
      <div className="flex min-w-0 min-h-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} showWorkspaceSwitcher={showWorkspaceSwitcher} />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
