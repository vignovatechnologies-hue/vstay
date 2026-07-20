import type { User } from "@/types/auth";

export const SEED_USERS: User[] = [
  {
    id: "u_owner_multi",
    email: "owner@hostly.app",
    fullName: "Rohan Verma",
    phone: "+91 98200 12345",
    role: "owner",
    workspaceIds: ["pg_greenhaven", "pg_skyline", "pg_meridian"],
    createdAt: "2024-02-12T08:00:00Z",
  },
  {
    id: "u_owner_single",
    email: "single@hostly.app",
    fullName: "Kavya Iyer",
    phone: "+91 98765 22110",
    role: "owner",
    workspaceIds: ["pg_lotus"],
    createdAt: "2024-03-22T08:00:00Z",
  },
  {
    id: "u_manager_1",
    email: "manager@hostly.app",
    fullName: "Devang Shah",
    role: "manager",
    workspaceIds: ["pg_greenhaven"],
    createdAt: "2024-04-01T08:00:00Z",
  },
  {
    id: "u_reception_1",
    email: "reception@hostly.app",
    fullName: "Pooja Nair",
    role: "reception",
    workspaceIds: ["pg_greenhaven"],
    createdAt: "2024-04-15T08:00:00Z",
  },
  {
    id: "u_tenant_1",
    email: "tenant@hostly.app",
    fullName: "Arjun Kapoor",
    phone: "+91 90000 11122",
    role: "tenant",
    workspaceIds: ["pg_greenhaven"],
    createdAt: "2024-05-09T08:00:00Z",
  },
];
