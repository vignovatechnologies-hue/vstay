import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_HOME } from "@/config/roles";
import { Check, Loader2, ArrowRight, LogIn } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlansConfig } from "@/lib/plans-config";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Hostly — Modern PG management, from bookings to billing" },
      {
        name: "description",
        content:
          "Run your PG or hostel with rent tracking, complaints, laundry slots and reports. Simple pricing, no setup fees.",
      },
      { property: "og:title", content: "Hostly — Modern PG management" },
      {
        property: "og:description",
        content: "Rent tracking, complaints, laundry slots and reports for PG operators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { status, user, session } = useAuth();

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "authenticated" && user) {
    if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) {
      return <Navigate to="/workspace-select" />;
    }
    return <Navigate to={ROLE_HOME[user.role]} />;
  }

  return <Landing />;
}

function Landing() {
  const [{ plans }] = usePlansConfig();

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
          <Logo />
          <nav className="flex items-center gap-2">
            <a
              href="#pricing"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Pricing
            </a>
            <Button asChild size="sm" variant="ghost">
              <Link to="/login">
                <LogIn className="mr-1 h-4 w-4" /> Sign in
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-24">
        <Badge variant="secondary" className="mb-4">
          New · Laundry slot booking
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Run your PG like a modern SaaS business.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Track rent, resolve complaints, manage staff and give tenants a beautiful self-serve app —
          all in one workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <a href="#pricing">
              See pricing <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-16 px-4 pb-20 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a plan that fits your PG. Cancel anytime.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={p.highlighted ? "border-primary shadow-lg" : "border-border/70"}
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
                      <Check className="mt-0.5 h-4 w-4 text-success" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={p.highlighted ? "default" : "outline"}
                >
                  <Link to="/login">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Hostly. All rights reserved.</p>
          <p>Made for PG operators in India.</p>
        </div>
      </footer>
    </div>
  );
}
