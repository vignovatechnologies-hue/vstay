import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Sparkles,
  Mail,
  Lock,
  Phone,
  User,
  ChevronRight,
  BadgePercent,
  CheckCircle2,
  Inbox,
  X,
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { LoginForm } from "@/features/auth/components/login-form";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_HOME } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { db, type MockEmail } from "@/mock/db";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in · Hostly" },
      { name: "description", content: "Sign in or sign up to your Hostly workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { status, user, session, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"owner" | "super_admin">("owner");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);

  useEffect(() => {
    // Check for auto-login invite param
    const params = new URLSearchParams(window.location.search);
    const inviteEmail = params.get("inviteEmail");
    if (inviteEmail && status === "unauthenticated" && !autoLoginLoading) {
      setAutoLoginLoading(true);
      const loadingToast = toast.loading(`Processing access URL for ${inviteEmail}...`);

      // Find user from mock db to get their dynamic password
      const userObj = db.users.find((u) => u.email.toLowerCase() === inviteEmail.toLowerCase());
      const pass = userObj?.password || "password";

      // Attempt login with the dynamic or standard password
      login(inviteEmail, pass)
        .then((result) => {
          toast.dismiss(loadingToast);
          toast.success(`Authenticated! Welcome back, ${result.user.fullName.split(" ")[0]}`);
          // Clear query params so refresh doesn't trigger it again
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          toast.error("Auto-login failed: User profile not found in mock database.");
          setAutoLoginLoading(false);
        });
    }
  }, [status, login, autoLoginLoading]);

  // If already authenticated and not processing auto login, redirect to target dashboard
  if (status === "authenticated" && user && !autoLoginLoading) {
    if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) {
      return <Navigate to="/workspace-select" />;
    }
    return <Navigate to={ROLE_HOME[user.role]} />;
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-[1fr_minmax(480px,560px)]">
      {/* Left: brand panel */}
      <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-primary lg:via-primary lg:to-[oklch(0.42_0.18_265)] lg:p-12 lg:text-primary-foreground">
        <div className="relative z-10">
          <Logo className="text-primary-foreground [&_span:last-child]:text-primary-foreground" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-md space-y-6"
        >
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Operate every PG, every bed, every rupee — from one place.
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Hostly brings owners, staff and tenants onto one dependable platform. Replace
            spreadsheets, WhatsApp groups and reminder calls with a system that keeps everyone in
            sync.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              { icon: Building2, label: "Multi-property workspaces & roles" },
              { icon: ShieldCheck, label: "Auditable rent, deposits & receipts" },
              { icon: Sparkles, label: "Tenant-facing app for requests & payments" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-foreground/10 ring-1 ring-inset ring-primary-foreground/20">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="text-primary-foreground/90">{item.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <p className="relative z-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Hostly. Built for hostel & PG operators.
        </p>
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl"
        />
      </aside>

      {/* Right: forms container */}
      <section className="flex flex-col justify-between px-6 py-12 sm:px-10">
        <div className="my-auto w-full mx-auto max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          {/* Role selector Tabs */}
          <div className="mb-8 flex rounded-lg bg-muted p-1 text-sm font-medium">
            <button
              onClick={() => {
                setActiveTab("owner");
                setAuthMode("signin");
              }}
              className={`flex-1 rounded-md py-2.5 text-center transition-all ${
                activeTab === "owner"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PG Owner / Admin
            </button>
            <button
              onClick={() => {
                setActiveTab("super_admin");
                setAuthMode("signin");
              }}
              className={`flex-1 rounded-md py-2.5 text-center transition-all ${
                activeTab === "super_admin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Super Admin
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {activeTab === "owner"
                ? authMode === "signin"
                  ? "Sign in as PG Owner"
                  : "Register your PG / Hostel"
                : "Super Admin Access"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "owner"
                ? authMode === "signin"
                  ? "Manage tenants, staff, beds, and billing."
                  : "Get started with your custom Hostly PG environment."
                : "Platform-wide management portal."}
            </p>
          </div>

          {autoLoginLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
              />
              <p className="text-sm font-medium text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "owner" && authMode === "signup" ? (
                <SignupForm onSignupSuccess={() => setAuthMode("signin")} />
              ) : (
                <LoginForm />
              )}

              {/* Show toggle for Sign In / Sign Up only on Owner portal */}
              {activeTab === "owner" && (
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  {authMode === "signin" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => setAuthMode("signup")}
                        className="font-medium text-primary hover:underline cursor-pointer"
                      >
                        Sign up now
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setAuthMode("signin")}
                        className="font-medium text-primary hover:underline cursor-pointer"
                      >
                        Sign in instead
                      </button>
                    </>
                  )}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

interface SignupFormProps {
  onSignupSuccess: () => void;
}

function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signup State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [planId, setPlanId] = useState<"monthly" | "yearly">("monthly");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !hostelName.trim()) {
      setError("Please fill in all details.");
      return;
    }

    setLoading(true);
    try {
      // Direct call to authService signup
      const result = await authService.signup({
        fullName,
        email,
        phone,
        hostelName,
        planId,
      });

      toast.success(`Registration complete! Welcome ${fullName}`);

      // Auto reload/navigate will occur once user session is loaded
      // We write session and trigger mounting checks
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            className="pl-9"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-phone">Phone number</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-9"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hostelName">PG / Hostel Name</Label>
        <div className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="hostelName"
            type="text"
            placeholder="e.g. Lotus Residency"
            className="pl-9"
            value={hostelName}
            onChange={(e) => setHostelName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Subscription Plan Selector */}
      <div className="space-y-2">
        <Label>Select Subscription Plan</Label>
        <div className="grid grid-cols-2 gap-3">
          {/* Monthly Card */}
          <div
            onClick={() => setPlanId("monthly")}
            className={`relative flex flex-col justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              planId === "monthly"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold">Monthly Plan</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  ₹999<span className="text-xs font-normal text-muted-foreground">/mo</span>
                </p>
              </div>
              {planId === "monthly" && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Flexible month-to-month billing
            </p>
          </div>

          {/* Yearly Card */}
          <div
            onClick={() => setPlanId("yearly")}
            className={`relative flex flex-col justify-between rounded-lg border p-4 cursor-pointer transition-all ${
              planId === "yearly"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Save 15%
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold">Yearly Plan</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  ₹9,999<span className="text-xs font-normal text-muted-foreground">/yr</span>
                </p>
              </div>
              {planId === "yearly" && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">Billed annually (Save ₹2,000+)</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            className="pl-9 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled
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
        <p className="text-[10px] text-muted-foreground">
          Password is preset to &quot;password&quot; for easy mock-auth login.
        </p>
      </div>

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? "Registering environment..." : "Complete Signup & Access Workspace"}
      </Button>
    </form>
  );
}
