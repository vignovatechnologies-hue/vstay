import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as downloadCSV } from "./actions-BLzNNc_h.js";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BarChart3, Download, TrendingDown, TrendingUp } from "lucide-react";
//#region src/routes/_authenticated.owner.reports.tsx?tsr-split=component
var MONTHS = [
	{
		m: "Jun",
		collected: 3.8,
		target: 4.5
	},
	{
		m: "Jul",
		collected: 4.1,
		target: 4.5
	},
	{
		m: "Aug",
		collected: 4.3,
		target: 4.6
	},
	{
		m: "Sep",
		collected: 4.4,
		target: 4.7
	},
	{
		m: "Oct",
		collected: 4.5,
		target: 4.8
	},
	{
		m: "Nov",
		collected: 4.62,
		target: 5
	}
];
var MAX = 5;
function ReportsPage() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function exportReport() {
		downloadCSV("owner-report-2026.csv", MONTHS);
		toast.success("Report exported");
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Reports",
		subtitle: "Financial and occupancy insights",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-4 flex justify-end",
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportReport,
					children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Export CSV"]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Revenue YTD",
						value: "₹ 48.2L",
						delta: "+12% YoY",
						tone: "up",
						icon: TrendingUp
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Avg. occupancy",
						value: "89%",
						delta: "+3 pts",
						tone: "up",
						icon: BarChart3
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Avg. tenure",
						value: "9.4 mo",
						delta: "+0.6",
						tone: "up",
						icon: TrendingUp
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Churn",
						value: "4.1%",
						delta: "-0.8 pts",
						tone: "up",
						icon: TrendingDown
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "mt-6 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: "Collections vs target (₹ Lakh)"
				}) }), /* @__PURE__ */ jsxs(CardContent, { children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-64 items-end justify-between gap-3",
					children: MONTHS.map((row) => /* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 flex-col items-center gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex h-full w-full items-end justify-center gap-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-1/2 rounded-t bg-primary",
								style: { height: `${row.collected / MAX * 100}%` },
								title: `Collected ₹${row.collected}L`
							}), /* @__PURE__ */ jsx("div", {
								className: "w-1/2 rounded-t bg-muted",
								style: { height: `${row.target / MAX * 100}%` },
								title: `Target ₹${row.target}L`
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-medium",
							children: row.m
						})]
					}, row.m))
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex justify-center gap-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-primary" }), " Collected"]
					}), /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-sm bg-muted" }), " Target"]
					})]
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: "Top revenue rooms"
					}) }), /* @__PURE__ */ jsx(CardContent, {
						className: "space-y-3",
						children: [
							{
								r: "Room 101 · Single AC",
								v: "₹ 16,500"
							},
							{
								r: "Room 205 · Single",
								v: "₹ 14,000"
							},
							{
								r: "Room 102 · Double AC",
								v: "₹ 24,000"
							}
						].map((x) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-border/50 pb-2 last:border-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm",
								children: x.r
							}), /* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: x.v
							})]
						}, x.r))
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
						className: "text-base",
						children: "Expense split (Nov)"
					}) }), /* @__PURE__ */ jsx(CardContent, {
						className: "space-y-3",
						children: [
							{
								l: "Housekeeping",
								v: 32
							},
							{
								l: "Utilities",
								v: 26
							},
							{
								l: "Maintenance",
								v: 18
							},
							{
								l: "Food",
								v: 24
							}
						].map((x) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-1 flex justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", { children: x.l }), /* @__PURE__ */ jsxs("span", {
								className: "font-medium",
								children: [x.v, "%"]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "h-2 rounded-full bg-muted",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${x.v}%` }
							})
						})] }, x.l))
					})]
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
