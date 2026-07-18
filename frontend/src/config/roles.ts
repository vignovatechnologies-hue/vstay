import type { UserRole } from "@/types/auth";

export type Permission =
  | "platform:manage"
  | "workspace:view"
  | "workspace:manage"
  | "tenants:view"
  | "tenants:manage"
  | "rooms:view"
  | "rooms:manage"
  | "payments:view"
  | "payments:manage"
  | "staff:view"
  | "staff:manage"
  | "reports:view"
  | "reports:export"
  | "complaints:view"
  | "complaints:manage"
  | "tenant:self";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "platform:manage",
    "workspace:view",
    "workspace:manage",
    "reports:view",
    "reports:export",
  ],
  owner: [
    "workspace:view",
    "workspace:manage",
    "tenants:view",
    "tenants:manage",
    "rooms:view",
    "rooms:manage",
    "payments:view",
    "payments:manage",
    "staff:view",
    "staff:manage",
    "complaints:view",
    "complaints:manage",
    "reports:view",
    "reports:export",
  ],
  manager: [
    "workspace:view",
    "tenants:view",
    "tenants:manage",
    "rooms:view",
    "rooms:manage",
    "payments:view",
    "staff:view",
    "complaints:view",
    "complaints:manage",
    "reports:view",
  ],
  reception: ["workspace:view", "tenants:view", "tenants:manage", "rooms:view", "complaints:view"],
  accountant: [
    "workspace:view",
    "payments:view",
    "payments:manage",
    "reports:view",
    "reports:export",
  ],
  warden: ["workspace:view", "tenants:view", "rooms:view", "complaints:view", "complaints:manage"],
  housekeeping: ["workspace:view", "rooms:view"],
  security: ["workspace:view", "tenants:view"],
  maintenance: ["workspace:view", "complaints:view", "complaints:manage"],
  laundry: ["workspace:view"],
  cook: ["workspace:view"],
  tenant: ["tenant:self"],
};

export const ROLE_LABEL: Record<UserRole, string> = {
  super_admin: "Super Admin",
  owner: "PG Owner",
  manager: "Manager",
  reception: "Reception",
  accountant: "Accountant",
  warden: "Warden",
  housekeeping: "Housekeeping",
  security: "Security",
  maintenance: "Maintenance",
  laundry: "Laundry",
  cook: "Cook",
  tenant: "Tenant",
};

export const ROLE_HOME: Record<UserRole, string> = {
  super_admin: "/super-admin/dashboard",
  owner: "/owner/dashboard",
  manager: "/staff/dashboard",
  reception: "/staff/dashboard",
  accountant: "/staff/dashboard",
  warden: "/staff/dashboard",
  housekeeping: "/staff/dashboard",
  security: "/staff/dashboard",
  maintenance: "/staff/dashboard",
  laundry: "/staff/dashboard",
  cook: "/staff/dashboard",
  tenant: "/tenant/dashboard",
};

export function isStaffRole(role: UserRole): boolean {
  return [
    "manager",
    "reception",
    "accountant",
    "warden",
    "housekeeping",
    "security",
    "maintenance",
    "laundry",
    "cook",
  ].includes(role);
}

export function getDashboardRouteForRole(role: UserRole | string | null | undefined): string {
  if (!role) return "/unauthorized";
  if (role === "super_admin") return "/super-admin/dashboard";
  if (role === "owner") return "/owner/dashboard";
  if (role === "tenant") return "/tenant/dashboard";
  if (isStaffRole(role as UserRole)) return "/staff/dashboard";
  return "/unauthorized";
}
