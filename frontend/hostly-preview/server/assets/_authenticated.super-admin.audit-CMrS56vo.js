import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as Input } from "./input-NvmijQlt.js";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Filter, Search, ShieldCheck } from "lucide-react";
//#region src/routes/_authenticated.super-admin.audit.tsx?tsr-split=component
var LOGS = [
	{
		t: "12:04 PM",
		actor: "aanya@hostly.app",
		role: "Super Admin",
		action: "workspace.suspended",
		target: "Green Tree PG",
		ip: "103.24.11.8",
		sev: "warn"
	},
	{
		t: "11:42 AM",
		actor: "rajesh@sunrisepg.in",
		role: "Owner",
		action: "billing.plan_upgraded",
		target: "Starter → Scale",
		ip: "49.207.180.22",
		sev: "info"
	},
	{
		t: "10:31 AM",
		actor: "system",
		role: "System",
		action: "invoice.generated",
		target: "INV-11284",
		ip: "—",
		sev: "info"
	},
	{
		t: "09:58 AM",
		actor: "meera@lotusladies.in",
		role: "Owner",
		action: "staff.invited",
		target: "pooja@hostly.app",
		ip: "117.99.44.10",
		sev: "info"
	},
	{
		t: "09:12 AM",
		actor: "unknown",
		role: "—",
		action: "auth.login_failed",
		target: "kavya@harmonyhostels.in",
		ip: "42.108.19.7",
		sev: "danger"
	},
	{
		t: "Yesterday 08:14 PM",
		actor: "aanya@hostly.app",
		role: "Super Admin",
		action: "role.granted",
		target: "vikram@hostly.app · Support",
		ip: "103.24.11.8",
		sev: "warn"
	},
	{
		t: "Yesterday 06:30 PM",
		actor: "arvind@urbannest.co",
		role: "Owner",
		action: "property.created",
		target: "Urban Nest · Whitefield",
		ip: "49.207.222.90",
		sev: "info"
	}
];
var SEV = {
	info: "bg-info/10 text-info",
	warn: "bg-warning/10 text-warning",
	danger: "bg-destructive/10 text-destructive"
};
function AuditPage() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Audit logs",
		subtitle: "Every privileged action across the platform",
		navGroups: SUPER_ADMIN_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Events today",
					value: "284",
					icon: ShieldCheck
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Failed logins (24h)",
					value: "12",
					tone: "down",
					icon: ShieldCheck
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Privileged changes",
					value: "9",
					tone: "neutral",
					icon: ShieldCheck
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Retention",
					value: "90 days",
					icon: ShieldCheck
				})
			]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-6 border-border/70",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "p-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-full max-w-xs",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search actor, action or target…",
							className: "pl-8"
						})]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), " Filter"]
					})]
				}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Time" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Actor" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Role" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Action" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Target" }),
					/* @__PURE__ */ jsx(TableHead, { children: "IP" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Severity" })
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: LOGS.map((l, i) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "whitespace-nowrap text-muted-foreground",
						children: l.t
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: l.actor
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: l.role
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: l.action
					}),
					/* @__PURE__ */ jsx(TableCell, { children: l.target }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs text-muted-foreground",
						children: l.ip
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: SEV[l.sev],
						children: l.sev
					}) })
				] }, i)) })] })]
			})
		})]
	});
}
//#endregion
export { AuditPage as component };
