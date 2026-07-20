import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_HOME } from "@/config/roles";
import { loginSchema, type LoginFormValues } from "../schemas";

const DEMO_ACCOUNTS = [
  { label: "Owner (3 PGs)", email: "owner@hostly.app" },
  { label: "Owner (1 PG)", email: "single@hostly.app" },
  { label: "Staff · Manager", email: "manager@hostly.app" },
  { label: "Tenant", email: "tenant@hostly.app" },
] as const;

export function LoginForm({ expectedRole }: { expectedRole?: "owner" | "super_admin" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "password" },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const result = await login(values.email, values.password, expectedRole);
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}`);
      if (result.requiresWorkspaceSelection) {
        navigate({ to: "/workspace-select" });
        return;
      }
      navigate({ to: "/" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="pl-9"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            className="pl-9 pr-10"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Demo accounts · password: <span className="font-mono">password</span>
        </p>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                form.setValue("email", account.email, { shouldValidate: true });
                form.setValue("password", "password");
              }}
              className="rounded px-2 py-1 text-left text-xs text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="font-medium">{account.label}</span>
              <span className="ml-1 text-muted-foreground">· {account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
