import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import { sessionStorage } from "@/lib/session-storage";
import { ROLE_PERMISSIONS, type Permission } from "@/config/roles";
import type { LoginResult, Session, User, UserRole } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string, expectedRole?: "owner" | "staff" | "tenant" | "super_admin") => Promise<LoginResult>;
  signup: (data: {
    fullName: string;
    email: string;
    phone: string;
    hostelName: string;
    password?: string;
    planId?: "monthly" | "yearly" | null;
  }) => Promise<LoginResult>;
  logout: () => Promise<void>;
  setActiveWorkspace: (workspaceId: string) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    const stored = sessionStorage.read();
    if (!stored) {
      setStatus("unauthenticated");
      return;
    }
    authService
      .me(stored.userId)
      .then((u) => {
        setSession(stored);
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        sessionStorage.clear();
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(
    async (email: string, password: string, expectedRole?: "owner" | "staff" | "tenant" | "super_admin") => {
      const result = await authService.login({ email, password });
      if (expectedRole) {
        const uRole = result.user.role;
        if (expectedRole === "owner" && uRole !== "owner") {
          throw new Error(`This account is registered as ${uRole === "tenant" ? "Tenant" : "Staff"}. Please select the ${uRole === "tenant" ? "Tenant" : "Staff"} tab to sign in.`);
        }
        if (expectedRole === "staff" && uRole === "owner") {
          throw new Error(`This account is registered as PG Owner. Please select the PG Owner tab to sign in.`);
        }
        if (expectedRole === "staff" && uRole === "tenant") {
          throw new Error(`This account is registered as Tenant. Please select the Tenant tab to sign in.`);
        }
        if (expectedRole === "tenant" && uRole !== "tenant") {
          throw new Error(`This account is registered as ${uRole === "owner" ? "PG Owner" : "Staff"}. Please select the ${uRole === "owner" ? "PG Owner" : "Staff"} tab to sign in.`);
        }
        if (expectedRole === "super_admin" && uRole !== "super_admin") {
          throw new Error("This account does not have Super Admin access.");
        }
      }
      sessionStorage.write(result.session);
      setSession(result.session);
      setUser(result.user);
      setStatus("authenticated");
      return result;
    },
    [],
  );

  const signup = useCallback(
    async (data: {
      fullName: string;
      email: string;
      phone: string;
      hostelName: string;
      password?: string;
      planId?: "monthly" | "yearly" | null;
    }) => {
      const result = await authService.signup(data);
      sessionStorage.write(result.session);
      setSession(result.session);
      setUser(result.user);
      setStatus("authenticated");
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    sessionStorage.clear();
    setSession(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const setActiveWorkspace = useCallback((workspaceId: string) => {
    sessionStorage.setActiveWorkspace(workspaceId);
    setSession((prev) => (prev ? { ...prev, workspaceId } : prev));
  }, []);

  const hasRole = useCallback(
    (role: UserRole | UserRole[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user.role);
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: Permission) => {
      if (!user) return false;
      return ROLE_PERMISSIONS[user.role].includes(permission);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, status, login, signup, logout, setActiveWorkspace, hasRole, hasPermission }),
    [user, session, status, login, signup, logout, setActiveWorkspace, hasRole, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
