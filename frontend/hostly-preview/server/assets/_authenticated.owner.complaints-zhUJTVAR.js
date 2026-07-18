import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { useMemo, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Filter, MessagesSquare } from "lucide-react";
//#region src/routes/_authenticated.owner.complaints.tsx?tsr-split=component
var SEED = [
	{
		id: "CMP-341",
		tenant: "Arjun Kapoor",
		room: "204·B",
		category: "Maintenance",
		subject: "AC not cooling",
		raised: "01 Dec",
		priority: "high",
		status: "open"
	},
	{
		id: "CMP-340",
		tenant: "Priya Sharma",
		room: "201·A",
		category: "Internet",
		subject: "Slow Wi-Fi in evenings",
		raised: "30 Nov",
		priority: "medium",
		status: "in_progress"
	},
	{
		id: "CMP-339",
		tenant: "Rahul Menon",
		room: "101",
		category: "Housekeeping",
		subject: "Bathroom cleaning skipped",
		raised: "29 Nov",
		priority: "low",
		status: "in_progress"
	},
	{
		id: "CMP-338",
		tenant: "Sneha Iyer",
		room: "301·A",
		category: "Food",
		subject: "Dinner served late",
		raised: "27 Nov",
		priority: "low",
		status: "resolved"
	},
	{
		id: "CMP-337",
		tenant: "Vikram Singh",
		room: "204·A",
		category: "Maintenance",
		subject: "Wardrobe hinge broken",
		raised: "25 Nov",
		priority: "medium",
		status: "resolved"
	}
];
var PRIO = {
	high: "bg-destructive/10 text-destructive",
	medium: "bg-warning/10 text-warning",
	low: "bg-muted text-muted-foreground"
};
var STATUS = {
	open: {
		label: "Open",
		className: "bg-destructive/10 text-destructive"
	},
	in_progress: {
		label: "In progress",
		className: "bg-warning/10 text-warning"
	},
	resolved: {
		label: "Resolved",
		className: "bg-success/10 text-success"
	}
};
function ComplaintsPage() {
	const { user } = useAuth();
	const { items, update } = useLocalCollection("hostly.owner.complaints", SEED);
	const [filter, setFilter] = useState("all");
	const filtered = useMemo(() => filter === "all" ? items : items.filter((i) => i.status === filter), [items, filter]);
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function setStatus(c, s) {
		update(c.id, { status: s });
		toast.success(`${c.id} → ${STATUS[s].label}`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Complaints",
		subtitle: "Tickets raised by tenants across the property",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Open",
					value: String(items.filter((c) => c.status === "open").length),
					tone: "down",
					icon: MessagesSquare
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "In progress",
					value: String(items.filter((c) => c.status === "in_progress").length),
					tone: "neutral",
					icon: MessagesSquare
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Resolved",
					value: String(items.filter((c) => c.status === "resolved").length),
					tone: "up",
					icon: MessagesSquare
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Avg. resolution",
					value: "18 hrs",
					tone: "up",
					icon: MessagesSquare
				})
			]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-6 border-border/70",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "p-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border/70 p-4",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: "All complaints"
					}), /* @__PURE__ */ jsxs(Select, {
						value: filter,
						onValueChange: (v) => setFilter(v),
						children: [/* @__PURE__ */ jsxs(SelectTrigger, {
							className: "h-8 w-[150px]",
							children: [/* @__PURE__ */ jsx(Filter, { className: "mr-1 h-3.5 w-3.5" }), /* @__PURE__ */ jsx(SelectValue, {})]
						}), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "all",
								children: "All"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "open",
								children: "Open"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "in_progress",
								children: "In progress"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "resolved",
								children: "Resolved"
							})
						] })]
					})]
				}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Ticket" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Tenant" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Room" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Subject" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Raised" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Priority" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsx(TableBody, { children: filtered.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: c.id
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: c.tenant
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs text-muted-foreground",
						children: c.room
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: c.category
					}),
					/* @__PURE__ */ jsx(TableCell, { children: c.subject }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: c.raised
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: PRIO[c.priority],
						children: c.priority
					}) }),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: STATUS[c.status].className,
						children: STATUS[c.status].label
					}) }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ jsxs(Select, {
							value: c.status,
							onValueChange: (v) => setStatus(c, v),
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "h-8 w-[130px] ml-auto",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsxs(SelectContent, { children: [
								/* @__PURE__ */ jsx(SelectItem, {
									value: "open",
									children: "Open"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "in_progress",
									children: "In progress"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "resolved",
									children: "Resolved"
								})
							] })]
						})
					})
				] }, c.id)) })] })]
			})
		})]
	});
}
//#endregion
export { ComplaintsPage as component };
