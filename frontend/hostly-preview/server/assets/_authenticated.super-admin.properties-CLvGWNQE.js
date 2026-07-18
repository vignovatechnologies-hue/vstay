import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as Input } from "./input-NvmijQlt.js";
import * as React from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Building2, Filter, Search } from "lucide-react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
//#region src/components/ui/progress.tsx
var Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(ProgressPrimitive.Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ jsx(ProgressPrimitive.Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = ProgressPrimitive.Root.displayName;
//#endregion
//#region src/routes/_authenticated.super-admin.properties.tsx?tsr-split=component
var PROPS = [
	{
		name: "Sunrise PG · Andheri",
		owner: "Rajesh Malhotra",
		city: "Mumbai",
		beds: 82,
		occ: 94,
		tier: "Premium"
	},
	{
		name: "Sunrise PG · Powai",
		owner: "Rajesh Malhotra",
		city: "Mumbai",
		beds: 64,
		occ: 88,
		tier: "Premium"
	},
	{
		name: "Lotus Ladies PG",
		owner: "Meera Krishnan",
		city: "Mumbai",
		beds: 48,
		occ: 92,
		tier: "Standard"
	},
	{
		name: "Urban Nest · HSR",
		owner: "Arvind Rao",
		city: "Bengaluru",
		beds: 96,
		occ: 97,
		tier: "Premium"
	},
	{
		name: "Urban Nest · Koramangala",
		owner: "Arvind Rao",
		city: "Bengaluru",
		beds: 72,
		occ: 85,
		tier: "Premium"
	},
	{
		name: "Harmony Hostels",
		owner: "Kavya Reddy",
		city: "Hyderabad",
		beds: 54,
		occ: 74,
		tier: "Standard"
	},
	{
		name: "Green Tree PG",
		owner: "Prakash Iyer",
		city: "Chennai",
		beds: 38,
		occ: 61,
		tier: "Starter"
	},
	{
		name: "Cozy Cribs · Sector 62",
		owner: "Nikhil Agarwal",
		city: "Noida",
		beds: 66,
		occ: 90,
		tier: "Standard"
	}
];
function PropertiesPage() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Properties",
		subtitle: "All PG properties active on the platform",
		navGroups: SUPER_ADMIN_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Total properties",
					value: "128",
					delta: "+6 this month",
					tone: "up",
					icon: Building2
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Total beds",
					value: "8,412",
					delta: "+184",
					tone: "up",
					icon: Building2
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Avg. occupancy",
					value: "87%",
					delta: "+2.1%",
					tone: "up",
					icon: Building2
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Cities live",
					value: "14",
					icon: Building2
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
							placeholder: "Search property or owner…",
							className: "pl-8"
						})]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), " Filter"]
					})]
				}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Property" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Owner" }),
					/* @__PURE__ */ jsx(TableHead, { children: "City" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Beds" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "w-[200px]",
						children: "Occupancy"
					}),
					/* @__PURE__ */ jsx(TableHead, { children: "Tier" })
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: PROPS.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: p.name
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: p.owner
					}),
					/* @__PURE__ */ jsx(TableCell, { children: p.city }),
					/* @__PURE__ */ jsx(TableCell, { children: p.beds }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Progress, {
							value: p.occ,
							className: "h-1.5 w-24"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs tabular-nums text-muted-foreground",
							children: [p.occ, "%"]
						})]
					}) }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						children: p.tier
					}) })
				] }, p.name)) })] })]
			})
		})]
	});
}
//#endregion
export { PropertiesPage as component };
