import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { t as downloadCSV } from "./actions-BLzNNc_h.js";
import { useMemo, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertCircle, CreditCard, Download, Filter, TrendingUp, Wallet } from "lucide-react";
//#region src/routes/_authenticated.owner.payments.tsx?tsr-split=component
var SEED = [
	{
		id: "INV-1104",
		tenant: "Arjun Kapoor",
		room: "204·B",
		month: "Nov 2026",
		amount: "₹ 11,500",
		date: "05 Nov",
		method: "UPI",
		status: "paid"
	},
	{
		id: "INV-1105",
		tenant: "Vikram Singh",
		room: "204·A",
		month: "Nov 2026",
		amount: "₹ 11,500",
		date: "03 Nov",
		method: "UPI",
		status: "paid"
	},
	{
		id: "INV-1106",
		tenant: "Nikhil Rao",
		room: "204·C",
		month: "Nov 2026",
		amount: "₹ 11,500",
		date: "—",
		method: "—",
		status: "due"
	},
	{
		id: "INV-1107",
		tenant: "Priya Sharma",
		room: "201·A",
		month: "Nov 2026",
		amount: "₹ 9,500",
		date: "06 Nov",
		method: "Bank",
		status: "paid"
	},
	{
		id: "INV-1108",
		tenant: "Rahul Menon",
		room: "101",
		month: "Nov 2026",
		amount: "₹ 16,500",
		date: "—",
		method: "—",
		status: "overdue"
	},
	{
		id: "INV-1109",
		tenant: "Sneha Iyer",
		room: "301·A",
		month: "Nov 2026",
		amount: "₹ 10,500",
		date: "04 Nov",
		method: "Card",
		status: "paid"
	}
];
var STATUS = {
	paid: "bg-success/10 text-success",
	due: "bg-warning/10 text-warning",
	overdue: "bg-destructive/10 text-destructive"
};
function PaymentsPage() {
	const { user } = useAuth();
	const { items, update } = useLocalCollection("hostly.owner.invoices", SEED);
	const [filter, setFilter] = useState("all");
	const filtered = useMemo(() => filter === "all" ? items : items.filter((i) => i.status === filter), [items, filter]);
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function remind(inv) {
		toast.success(`Reminder sent to ${inv.tenant}`);
	}
	function markPaid(inv) {
		update(inv.id, {
			status: "paid",
			date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short"
			}),
			method: "Manual"
		});
		toast.success(`${inv.id} marked as paid`);
	}
	function exportCsv() {
		downloadCSV("invoices-november-2026.csv", filtered);
		toast.success("Invoices exported");
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Rent & Payments",
		subtitle: "Collections, dues and payment history",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Collected (Nov)",
					value: "₹ 4.62L",
					delta: "92%",
					tone: "up",
					icon: Wallet
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Pending",
					value: "₹ 38,000",
					delta: "3 invoices",
					tone: "neutral",
					icon: CreditCard
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Overdue",
					value: "₹ 16,500",
					delta: "1 tenant",
					tone: "down",
					icon: AlertCircle
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "MoM growth",
					value: "+8.4%",
					tone: "up",
					icon: TrendingUp
				})
			]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "mt-6 border-border/70",
			children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "flex flex-row items-center justify-between",
				children: [/* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: "Invoices · November 2026"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs(Select, {
						value: filter,
						onValueChange: (v) => setFilter(v),
						children: [/* @__PURE__ */ jsxs(SelectTrigger, {
							className: "h-8 w-[130px]",
							children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), /* @__PURE__ */ jsx(SelectValue, {})]
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "all",
								children: "All"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "paid",
								children: "Paid"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "due",
								children: "Due"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "overdue",
								children: "Overdue"
							})
						] })]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						onClick: exportCsv,
						children: [/* @__PURE__ */ jsx(Download, { className: "mr-1 h-3.5 w-3.5" }), " Export"]
					})]
				})]
			}), /* @__PURE__ */ jsx(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Invoice" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Tenant" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Room" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Month" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Amount" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Paid on" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Method" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: filtered.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: p.id
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: p.tenant
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs text-muted-foreground",
						children: p.room
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: p.month
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-semibold",
						children: p.amount
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: p.date
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: p.method
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: STATUS[p.status],
						children: p.status
					}) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right space-x-1",
						children: [p.status !== "paid" && /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => markPaid(p),
							children: "Mark paid"
						}), p.status !== "paid" && /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => remind(p),
							children: "Remind"
						})]
					})
				] }, p.id)) })] })
			})]
		})]
	});
}
//#endregion
export { PaymentsPage as component };
