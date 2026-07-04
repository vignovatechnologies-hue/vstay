import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  ssr: false,
  head: () => ({ meta: [{ title: "Access denied · Hostly" }] }),
  component: () => (
    <div className="grid min-h-dvh place-items-center bg-background px-6">
      <div className="max-w-md text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-warning" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">You don&apos;t have access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn&apos;t have permission to view this page. If you think this is a
          mistake, ask your workspace administrator.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link to="/">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Switch account</Link>
          </Button>
        </div>
      </div>
    </div>
  ),
});
