import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as downloadCSV } from "./actions-BLzNNc_h.js";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BarChart3, Building2, Download, TrendingUp, Users } from "lucide-react";
//#region src/routes/_authenticated.super-admin.reports.tsx?tsr-split=component
var SIGNUPS = [
	{
		m: "Jun",
		v: 6
	},
	{
		m: "Jul",
		v: 9
	},
	{
		m: "Aug",
		v: 11
	},
	{
		m: "Sep",
		v: 8
	},
	{
		m: "Oct",
		v: 14
	},
	{
		m: "Nov",
		v: 18
	}
];
var CITIES = [
	{
		city: "Bengaluru",
		owners: 28,
		share: 30
	},
	{
		city: "Mumbai",
		owners: 22,
		share: 23
	},
	{
		city: "Hyderabad",
		owners: 14,
		share: 15
	},
	{
		city: "Pune",
		owners: 10,
		share: 11
	},
	{
		city: "Chennai",
		owners: 8,
		share: 9
	},
	{
		city: "Others",
		owners: 12,
		share: 12
	}
];
function ReportsPage() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	const max = Math.max(...SIGNUPS.map((s) => s.v));
	const exportCsv = () => {
		downloadCSV("platform-report.csv", [...SIGNUPS, ...CITIES]);
		toast.success("Report exported");
	};
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Reports",
		subtitle: "Platform-wide analytics and insights",
		navGroups: SUPER_ADMIN_NAV,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-4 flex justify-end",
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportCsv,
					children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Export CSV"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "New owners (30d)",
						value: "18",
						delta: "+38%",
						tone: "up",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Bed additions",
						value: "+184",
						tone: "up",
						icon: Building2
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Platform GMV",
						value: "₹ 3.42Cr",
						delta: "+14.2%",
						tone: "up",
						icon: TrendingUp
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Support tickets",
						value: "42",
						delta: "−8 vs prev",
						tone: "up",
						icon: BarChart3
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: "Owner sign-ups · last 6 months"
					}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
						className: "flex h-52 items-end gap-6",
						children: SIGNUPS.map((s) => /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 flex-col items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex h-full w-full items-end",
									children: /* @__PURE__ */ jsx("div", {
										className: "w-full rounded-t bg-info/80",
										style: { height: `${s.v / max * 100}%` }
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground",
									children: s.m
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-medium tabular-nums",
									children: s.v
								})
							]
						}, s.m))
					}) })]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: "Owners by city"
					}) }), /* @__PURE__ */ jsx(CardContent, {
						className: "space-y-3",
						children: CITIES.map((c) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-1 flex justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: c.city
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-muted-foreground",
								children: [
									c.owners,
									" owners · ",
									c.share,
									"%"
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "h-2 w-full rounded-full bg-muted",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${c.share * 3}%` }
							})
						})] }, c.city))
					})]
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
