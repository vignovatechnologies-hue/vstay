import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as downloadCSV } from "./actions-BLzNNc_h.js";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CreditCard, Download, TrendingUp } from "lucide-react";
//#region src/routes/_authenticated.super-admin.revenue.tsx?tsr-split=component
var MONTHS = [
	{
		m: "Jun",
		v: 62
	},
	{
		m: "Jul",
		v: 68
	},
	{
		m: "Aug",
		v: 71
	},
	{
		m: "Sep",
		v: 74
	},
	{
		m: "Oct",
		v: 78
	},
	{
		m: "Nov",
		v: 84
	}
];
var INVOICES = [
	{
		id: "INV-11284",
		owner: "Rajesh Malhotra",
		plan: "Scale",
		amount: "₹ 12,996",
		date: "01 Dec 2026",
		status: "paid"
	},
	{
		id: "INV-11283",
		owner: "Arvind Rao",
		plan: "Scale",
		amount: "₹ 12,996",
		date: "01 Dec 2026",
		status: "paid"
	},
	{
		id: "INV-11282",
		owner: "Meera Krishnan",
		plan: "Growth",
		amount: "₹ 2,499",
		date: "01 Dec 2026",
		status: "paid"
	},
	{
		id: "INV-11281",
		owner: "Prakash Iyer",
		plan: "Starter",
		amount: "₹ 999",
		date: "01 Dec 2026",
		status: "past_due"
	},
	{
		id: "INV-11280",
		owner: "Nikhil Agarwal",
		plan: "Growth",
		amount: "₹ 2,499",
		date: "01 Dec 2026",
		status: "paid"
	},
	{
		id: "INV-11279",
		owner: "Kavya Reddy",
		plan: "Growth",
		amount: "₹ 0",
		date: "01 Dec 2026",
		status: "trial"
	}
];
var STATUS = {
	paid: {
		label: "Paid",
		className: "bg-success/10 text-success"
	},
	past_due: {
		label: "Past due",
		className: "bg-destructive/10 text-destructive"
	},
	trial: {
		label: "Trial",
		className: "bg-info/10 text-info"
	}
};
function RevenuePage() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	const max = Math.max(...MONTHS.map((m) => m.v));
	const exportCsv = () => {
		downloadCSV("platform-invoices.csv", INVOICES);
		toast.success("Invoices exported");
	};
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Revenue",
		subtitle: "Subscription and platform earnings",
		navGroups: SUPER_ADMIN_NAV,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "MRR",
						value: "₹ 8.4L",
						delta: "+12.4%",
						tone: "up",
						icon: CreditCard
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "ARR",
						value: "₹ 1.01Cr",
						delta: "+18.6%",
						tone: "up",
						icon: TrendingUp
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "ARPA",
						value: "₹ 8,936",
						delta: "+₹ 412",
						tone: "up",
						icon: CreditCard
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Churn (30d)",
						value: "1.8%",
						delta: "−0.4%",
						tone: "up",
						icon: CreditCard
					})
				]
			}),
			/* @__PURE__ */ jsxs(Card, {
				className: "mt-6 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: "MRR trend · last 6 months"
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
					className: "flex h-52 items-end gap-6",
					children: MONTHS.map((m) => /* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 flex-col items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex h-full w-full items-end",
								children: /* @__PURE__ */ jsx("div", {
									className: "w-full rounded-t bg-primary/80",
									style: { height: `${m.v / max * 100}%` }
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: m.m
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-xs font-medium tabular-nums",
								children: [
									"₹ ",
									m.v,
									"k"
								]
							})
						]
					}, m.m))
				}) })]
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "mt-4 border-border/70",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "p-0",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-border/70 p-4",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium",
							children: "Recent invoices"
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: exportCsv,
							children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Export"]
						})]
					}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Invoice" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Owner" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Plan" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Amount" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Date" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Status" })
					] }) }), /* @__PURE__ */ jsx(TableBody, { children: INVOICES.map((i) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: i.id
						}),
						/* @__PURE__ */ jsx(TableCell, { children: i.owner }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: i.plan
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-medium",
							children: i.amount
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-muted-foreground",
							children: i.date
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: STATUS[i.status].className,
							children: STATUS[i.status].label
						}) })
					] }, i.id)) })] })]
				})
			})
		]
	});
}
//#endregion
export { RevenuePage as component };
