import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema, type LoginFormValues } from "../schemas";

interface DemoAccount {
  label: string;
  email: string;
  badge?: string;
  iconColor: string;
}

const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { label: "Owner (Multi-PG)", email: "owner@vstay.app", badge: "3 PGs", iconColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
  { label: "Owner (Single PG)", email: "single@vstay.app", badge: "1 PGs", iconColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
  { label: "Staff (Reception)", email: "reception@vstay.app", iconColor: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400" },
  { label: "Tenant (Resident)", email: "tenant@vstay.app", iconColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" },
];

export function LoginForm({ expectedRole }: { expectedRole?: "owner" | "staff" | "tenant" | "super_admin" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "password" },
  });

  useEffect(() => {
    if (expectedRole === "owner") {
      form.setValue("email", "owner@vstay.app", { shouldValidate: true });
      form.setValue("password", "password");
    } else if (expectedRole === "staff") {
      form.setValue("email", "reception@vstay.app", { shouldValidate: true });
      form.setValue("password", "password");
    } else if (expectedRole === "tenant") {
      form.setValue("email", "tenant@vstay.app", { shouldValidate: true });
      form.setValue("password", "password");
    } else if (expectedRole === "super_admin") {
      form.setValue("email", "admin@vstay.app", { shouldValidate: true });
      form.setValue("password", "password");
    }
  }, [expectedRole, form]);

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const roleCheck = expectedRole === "super_admin" ? "super_admin" : undefined;
      const result = await login(values.email, values.password, roleCheck);
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}`);
      if (result.requiresWorkspaceSelection) {
        navigate({ to: "/workspace-select" });
        return;
      }
      navigate({ to: "/" });
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : "Invalid username/email or password.";
      setServerError(msg);
    }
  }

  async function handleDemoLogin(email: string) {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", "password");
    setServerError(null);
    try {
      const result = await login(email, "password");
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}`);
      if (result.requiresWorkspaceSelection) {
        navigate({ to: "/workspace-select" });
        return;
      }
      navigate({ to: "/" });
    } catch (err: any) {
      const msg = err?.message ? String(err.message) : "Invalid demo credentials.";
      setServerError(msg);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError ? (
        <Alert variant="destructive" className="py-2.5 rounded-xl border-red-200 dark:border-red-900 bg-red-50/80 dark:bg-red-950/50 text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-semibold">{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-300">Email or Username</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="text"
            autoComplete="username"
            placeholder="Email address or username"
            className="pl-9 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</Label>
          <a href="#" className="text-xs font-bold text-[#1D61F2] hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            className="pl-9 pr-10 h-11 text-sm bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 py-0.5">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#1D61F2]"
        />
        <Label htmlFor="rememberMe" className="text-xs text-gray-600 dark:text-gray-400 font-semibold cursor-pointer select-none">
          Remember me
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#1D61F2] hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 text-sm rounded-lg shadow-sm transition-all"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Demo Accounts Card Grid Container */}
      <div className="mt-6 p-4 rounded-2xl bg-[#F4F7FC]/80 dark:bg-slate-900/60 border border-gray-200/60 dark:border-gray-800/60 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Demo Accounts
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => handleDemoLogin(account.email)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer text-left shadow-sm group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`h-8 w-8 rounded-full grid place-items-center shrink-0 ${account.iconColor}`}>
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-[#1D61F2] dark:group-hover:text-blue-400 truncate">
                    {account.label}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate font-medium">{account.email}</p>
                </div>
              </div>
              {account.badge && (
                <span className="text-[10px] font-bold text-[#1D61F2] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2 py-0.5 rounded-full shrink-0 border border-blue-200/50 dark:border-blue-800">
                  {account.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
