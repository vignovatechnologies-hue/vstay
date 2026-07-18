import { i as ROLE_LABEL, n as useAuth, o as isStaffRole } from "./auth-provider-ucs5_vFo.js";
import { a as DashboardShell, n as STAFF_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BedDouble, ClipboardList, MessagesSquare, Users } from "lucide-react";
//#region src/routes/_authenticated.staff.dashboard.tsx?tsr-split=component
function StaffDashboard() {
	const { user } = useAuth();
	if (!user) return null;
	if (!isStaffRole(user.role)) return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: `${ROLE_LABEL[user.role]} dashboard`,
		subtitle: "Today's priorities for your shift",
		navGroups: STAFF_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Check-ins today",
					value: "4",
					icon: Users
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Open complaints",
					value: "3",
					delta: "1 high priority",
					tone: "down",
					icon: MessagesSquare
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Rooms to inspect",
					value: "12",
					icon: BedDouble
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Tasks",
					value: "7",
					delta: "2 due today",
					tone: "neutral",
					icon: ClipboardList
				})
			]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-6 border-border/70",
			children: /* @__PURE__ */ jsx(CardContent, {
				className: "p-6",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Role-specific workflows (reception check-in flow, housekeeping board, maintenance queue, complaint triage) come online in later phases. The navigation, permissions, and shell adapt automatically based on the signed-in role."
				})
			})
		})]
	});
}
//#endregion
export { StaffDashboard as component };
