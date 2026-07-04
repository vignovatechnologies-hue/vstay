import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  FileText,
  BedDouble,
  Wrench,
  MessagesSquare,
  WashingMachine,
  Tag,
} from "lucide-react";
import type { NavGroup } from "@/components/layout/sidebar";

export const SUPER_ADMIN_NAV: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { label: "Overview", to: "/super-admin/dashboard", icon: LayoutDashboard },
      { label: "Owners", to: "/super-admin/owners", icon: Users },
      { label: "Properties", to: "/super-admin/properties", icon: Building2 },
      { label: "Revenue", to: "/super-admin/revenue", icon: CreditCard },
      { label: "Plans & Pricing", to: "/super-admin/plans", icon: Tag },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Reports", to: "/super-admin/reports", icon: BarChart3 },
      { label: "Audit logs", to: "/super-admin/audit", icon: ShieldCheck },
      { label: "Announcements", to: "/super-admin/announcements", icon: Bell },
      { label: "Settings", to: "/super-admin/settings", icon: Settings },
    ],
  },
];

export const OWNER_NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", to: "/owner/dashboard", icon: LayoutDashboard },
      { label: "Properties", to: "/owner/properties", icon: Building2 },
      { label: "Rooms & Beds", to: "/owner/rooms", icon: BedDouble },
      { label: "Tenants", to: "/owner/tenants", icon: Users },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Rent & Payments", to: "/owner/payments", icon: CreditCard },
      { label: "Reports", to: "/owner/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Staff", to: "/owner/staff", icon: Users },
      { label: "Complaints", to: "/owner/complaints", icon: MessagesSquare },
      { label: "Settings", to: "/owner/settings", icon: Settings },
    ],
  },
];

export const STAFF_NAV: NavGroup[] = [
  {
    label: "Today",
    items: [
      { label: "Dashboard", to: "/staff/dashboard", icon: LayoutDashboard },
      { label: "Tenants", to: "/staff/tenants", icon: Users },
      { label: "Rooms", to: "/staff/rooms", icon: BedDouble },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Complaints", to: "/staff/complaints", icon: MessagesSquare },
      { label: "Maintenance", to: "/staff/maintenance", icon: Wrench },
    ],
  },
];

export const TENANT_NAV: NavGroup[] = [
  {
    label: "My stay",
    items: [
      { label: "Dashboard", to: "/tenant/dashboard", icon: LayoutDashboard },
      { label: "My room", to: "/tenant/room", icon: BedDouble },
      { label: "Rent & receipts", to: "/tenant/payments", icon: CreditCard },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Laundry", to: "/tenant/laundry", icon: WashingMachine },
      { label: "Complaints", to: "/tenant/complaints", icon: MessagesSquare },
      { label: "Documents", to: "/tenant/documents", icon: FileText },
    ],
  },
];
