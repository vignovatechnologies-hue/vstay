import { a as getDashboardRouteForRole, d as db, n as useAuth, o as isStaffRole } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV, n as STAFF_NAV, r as SUPER_ADMIN_NAV, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { n as usePlansConfig } from "./plans-config-DbzXgPhf.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check } from "lucide-react";
//#region src/routes/_authenticated.pricing.tsx?tsr-split=component
function PricingPage() {
	const { user } = useAuth();
	const { activeWorkspace } = useWorkspace();
	const [{ plans }] = usePlansConfig();
	const navigate = useNavigate();
	if (!user) return null;
	const navGroups = user.role === "super_admin" ? SUPER_ADMIN_NAV : user.role === "owner" ? OWNER_NAV : isStaffRole(user.role) ? STAFF_NAV : user.role === "tenant" ? TENANT_NAV : [];
	const handleSelectPlan = (planId) => {
		if (user.role === "owner" && activeWorkspace) {
			const workspace = db.workspaces.find((w) => w.id === activeWorkspace.id);
			if (workspace) {
				workspace.planId = planId;
				db.save();
			}
		}
		toast.success("Subscription plan activated!");
		navigate({ to: getDashboardRouteForRole(user.role) });
	};
	return /* @__PURE__ */ jsx(DashboardShell, {
		title: "Subscription Plan",
		subtitle: "Select a plan to continue accessing your workspace features",
		navGroups,
		showWorkspaceSwitcher: user.role === "owner",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl mt-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-semibold tracking-tight md:text-3xl",
					children: "Choose your plan"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Select the plan that fits your PG the best."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: plans.map((p) => /* @__PURE__ */ jsx(Card, {
					className: p.highlighted ? "border-primary shadow-lg" : "border-border/70",
					children: /* @__PURE__ */ jsxs(CardContent, {
						className: "p-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-semibold",
									children: p.name
								}), p.highlighted && /* @__PURE__ */ jsx(Badge, { children: "Best value" })]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: p.tagline
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex items-baseline gap-1",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-4xl font-semibold tracking-tight",
									children: [p.currency, p.price.toLocaleString("en-IN")]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm text-muted-foreground",
									children: p.period
								})]
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "mt-6 space-y-2 text-sm",
								children: p.features.map((f) => /* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-2",
									children: [
										/* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 text-emerald-500" }),
										" ",
										/* @__PURE__ */ jsx("span", { children: f })
									]
								}, f))
							}),
							/* @__PURE__ */ jsxs(Button, {
								onClick: () => handleSelectPlan(p.id),
								className: "mt-6 w-full",
								variant: p.highlighted ? "default" : "outline",
								children: ["Select ", p.name]
							})
						]
					})
				}, p.id))
			})]
		})
	});
}
//#endregion
export { PricingPage as component };
