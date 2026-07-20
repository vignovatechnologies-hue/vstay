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
  login: (email: string, password: string, expectedRole?: "owner" | "super_admin") => Promise<LoginResult>;
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

  const login = useCallback(async (email: string, password: string, expectedRole?: "owner" | "super_admin") => {
    const result = await authService.login({ email, password });
    if (expectedRole === "super_admin" && result.user.role !== "super_admin") {
      throw new Error("Access denied: This account is not a Super Admin.");
    }
    if (expectedRole === "owner" && result.user.role === "super_admin") {
      throw new Error("Access denied: Please use the Super Admin portal to log in.");
    }
    sessionStorage.write(result.session);
    setSession(result.session);
    setUser(result.user);
    setStatus("authenticated");
    return result;
  }, []);

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
    () => ({ user, session, status, login, logout, setActiveWorkspace, hasRole, hasPermission }),
    [user, session, status, login, logout, setActiveWorkspace, hasRole, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
