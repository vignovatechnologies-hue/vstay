import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { n as Switch, t as Separator } from "./separator-Bf4oMHMn.js";
import { n as usePlansConfig, t as DEFAULT_PLANS } from "./plans-config-DbzXgPhf.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Plus, RotateCcw, Tag, X } from "lucide-react";
//#region src/routes/_authenticated.super-admin.plans.tsx?tsr-split=component
function PlansPage() {
	const { user } = useAuth();
	const [config, setConfig] = usePlansConfig();
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function updatePlan(id, patch) {
		setConfig({ plans: config.plans.map((p) => p.id === id ? {
			...p,
			...patch
		} : p) });
	}
	function savePlan(p) {
		if (!p.name.trim() || !Number.isFinite(p.price) || p.price < 0) {
			toast.error("Enter a valid name and price");
			return;
		}
		toast.success(`${p.name} plan updated`);
	}
	function resetAll() {
		setConfig(DEFAULT_PLANS);
		toast.success("Plans reset to defaults");
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Plans & Pricing",
		subtitle: "Edit subscription plans shown on the landing page",
		navGroups: SUPER_ADMIN_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Changes appear instantly on the home page pricing section."
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: resetAll,
				children: [/* @__PURE__ */ jsx(RotateCcw, { className: "mr-1 h-4 w-4" }), " Reset to defaults"]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: config.plans.map((p) => /* @__PURE__ */ jsx(PlanEditor, {
				plan: p,
				onChange: (patch) => updatePlan(p.id, patch),
				onSave: () => savePlan(p)
			}, p.id))
		})]
	});
}
function PlanEditor({ plan, onChange, onSave }) {
	const [feature, setFeature] = useState("");
	function addFeature() {
		const v = feature.trim();
		if (!v) return;
		onChange({ features: [...plan.features, v] });
		setFeature("");
	}
	function removeFeature(i) {
		onChange({ features: plan.features.filter((_, idx) => idx !== i) });
	}
	return /* @__PURE__ */ jsxs(Card, {
		className: plan.highlighted ? "border-primary" : "border-border/70",
		children: [/* @__PURE__ */ jsxs(CardHeader, {
			className: "flex flex-row items-center justify-between",
			children: [/* @__PURE__ */ jsxs(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [
					/* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
					" ",
					plan.name,
					" plan"
				]
			}), plan.highlighted && /* @__PURE__ */ jsx(Badge, { children: "Highlighted" })]
		}), /* @__PURE__ */ jsxs(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Plan name" }), /* @__PURE__ */ jsx(Input, {
							value: plan.name,
							onChange: (e) => onChange({ name: e.target.value }),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Tagline" }), /* @__PURE__ */ jsx(Input, {
							value: plan.tagline,
							onChange: (e) => onChange({ tagline: e.target.value }),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Currency" }), /* @__PURE__ */ jsx(Input, {
							value: plan.currency,
							onChange: (e) => onChange({ currency: e.target.value }),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Price" }), /* @__PURE__ */ jsx(Input, {
							type: "number",
							min: 0,
							value: plan.price,
							onChange: (e) => onChange({ price: Number(e.target.value) }),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx(Label, { children: "Period label" }), /* @__PURE__ */ jsx(Input, {
								value: plan.period,
								placeholder: "/month",
								onChange: (e) => onChange({ period: e.target.value }),
								className: "mt-1.5"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between rounded-md border border-border/70 p-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium",
						children: "Highlight this plan"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "Displays a \"Best value\" badge on the landing page"
					})] }), /* @__PURE__ */ jsx(Switch, {
						checked: !!plan.highlighted,
						onCheckedChange: (v) => onChange({ highlighted: v })
					})]
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(Label, { children: "Features" }),
					/* @__PURE__ */ jsxs("ul", {
						className: "mt-2 space-y-2",
						children: [plan.features.map((f, i) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center justify-between rounded-md border border-border/70 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ jsx("span", { children: f }), /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => removeFeature(i),
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						}, `${f}-${i}`)), plan.features.length === 0 && /* @__PURE__ */ jsx("li", {
							className: "text-xs text-muted-foreground",
							children: "No features yet."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ jsx(Input, {
							placeholder: "Add a feature…",
							value: feature,
							onChange: (e) => setFeature(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									addFeature();
								}
							}
						}), /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: addFeature,
							children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add"]
						})]
					})
				] }),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ jsx(Button, {
						size: "sm",
						onClick: onSave,
						children: "Save plan"
					})
				})
			]
		})]
	});
}
//#endregion
export { PlansPage as component };
