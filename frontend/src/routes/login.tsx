import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Users,
  TrendingUp,
  ShieldCheck,
  Star,
  BedDouble,
  UserCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { getDashboardRouteForRole } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { db } from "@/mock/db";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in · Vstay" },
      { name: "description", content: "Sign in or sign up to your Vstay workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { status, user, session, login } = useAuth();
  const [activeTab, setActiveTab] = useState<"owner" | "staff" | "tenant" | "super_admin">("owner");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteEmail = params.get("inviteEmail");
    if (inviteEmail && status === "unauthenticated" && !autoLoginLoading) {
      setAutoLoginLoading(true);
      const loadingToast = toast.loading(`Processing access URL for ${inviteEmail}...`);
      const userObj = db.users.find((u) => u.email.toLowerCase() === inviteEmail.toLowerCase());
      const pass = userObj?.password || "password";

      login(inviteEmail, pass)
        .then((result) => {
          toast.dismiss(loadingToast);
          toast.success(`Authenticated! Welcome back, ${result.user.fullName.split(" ")[0]}`);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(() => {
          toast.dismiss(loadingToast);
          toast.error("Auto-login failed.");
          setAutoLoginLoading(false);
        });
    }
  }, [status, login, autoLoginLoading]);

  if (status === "authenticated" && user && !autoLoginLoading) {
    if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) {
      return <Navigate to="/workspace-select" />;
    }
    return <Navigate to={getDashboardRouteForRole(user.role)} />;
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 bg-background lg:grid-cols-[1.15fr_1fr]">
      {/* Left: Brand & Visual Highlights Panel (Direct User Uploaded Image) */}
      <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-[#03091B] p-0 border-r border-white/10">
        <img
          src="/images/left_panel_mockup.jpg"
          alt="Vstay Platform Showcase"
          className="h-full w-full object-cover object-left-top min-h-full"
        />
      </aside>

      {/* Right: Sign In Form Container */}
      <section className="flex flex-col justify-between p-6 sm:p-10 bg-[#FAFBFD] dark:bg-[#080D1A]">
        {/* Top Header Bar */}
        <div className="flex w-full items-center justify-between lg:justify-end gap-3 mb-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {authMode === "signin" ? "New to Vstay?" : "Already have an account?"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("owner");
                setAuthMode(authMode === "signin" ? "signup" : "signin");
              }}
              className="text-xs font-semibold text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              {authMode === "signin" ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </div>

        <div className="my-auto w-full mx-auto max-w-md">
          {/* Underline Role Selector Tabs */}
          <div className="mb-6 flex border-b border-gray-200 dark:border-gray-800 text-sm font-semibold">
            {[
              { id: "owner", label: "PG Owner / Admin" },
              { id: "staff", label: "Staff" },
              { id: "tenant", label: "Tenant" },
              { id: "super_admin", label: "Admin" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setAuthMode("signin");
                }}
                className={`py-2.5 px-3 text-center transition-all duration-200 border-b-2 whitespace-nowrap text-xs sm:text-sm font-semibold flex-1 ${
                  activeTab === tab.id
                    ? "border-[#1D61F2] text-[#1D61F2] dark:text-blue-400 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Welcome Header */}
          <div className="mb-6 flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1D61F2] grid place-items-center shrink-0 border border-blue-100 dark:border-blue-900/50">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {authMode === "signin" ? "Welcome back!" : "Create PG Owner Account"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {authMode === "signin"
                  ? "Sign in to continue to your account"
                  : "Register your PG / Hostel on Vstay"}
              </p>
            </div>
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
          ) : authMode === "signup" && activeTab === "owner" ? (
            <SignupForm />
          ) : (
            <LoginForm expectedRole={activeTab} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-800 pt-4 mt-6">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="h-3.5 w-3.5" /> Your data is encrypted and secure
          </span>
          <span className="font-medium">© 2025 Vstay</span>
        </div>
      </section>
    </div>
  );
}
