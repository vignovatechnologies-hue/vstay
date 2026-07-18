import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BedDouble, CreditCard, FileText, MessagesSquare } from "lucide-react";
//#region src/routes/_authenticated.tenant.dashboard.tsx?tsr-split=component
function TenantDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: `Hello, ${user.fullName.split(" ")[0]}`,
		subtitle: "Your stay at Greenhaven Residency, Room 204",
		navGroups: TENANT_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Next rent due",
					value: "Dec 5",
					delta: "₹ 11,500",
					icon: CreditCard,
					tone: "neutral"
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Room",
					value: "204 · Bed B",
					icon: BedDouble
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Open requests",
					value: "1",
					delta: "In progress",
					icon: MessagesSquare,
					tone: "neutral"
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Documents",
					value: "3",
					delta: "All verified",
					icon: FileText,
					tone: "up"
				})
			]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-6 border-border/70",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "space-y-3 p-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-base font-semibold tracking-tight",
						children: "Coming up"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Rent payment with UPI/cards, deposit & receipt history, complaint filing with photo uploads, food/laundry preferences and digital agreements come online in the tenant phase."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: [/* @__PURE__ */ jsx(Button, {
							size: "sm",
							onClick: () => navigate({ to: "/tenant/payments" }),
							children: "Pay rent"
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => navigate({ to: "/tenant/complaints" }),
							children: "Raise complaint"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { TenantDashboard as component };
