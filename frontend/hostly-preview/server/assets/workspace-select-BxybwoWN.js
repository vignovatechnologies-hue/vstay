import { n as useAuth, r as ROLE_HOME } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { t as Logo } from "./logo-CiKh46W1.js";
import { t as Card } from "./card-BM637P_-.js";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Building2, LogOut, MapPin } from "lucide-react";
import { motion } from "framer-motion";
//#region src/routes/workspace-select.tsx?tsr-split=component
var ACCENT = {
	blue: "bg-info/15 text-info",
	violet: "bg-[oklch(0.93_0.05_300)] text-[oklch(0.45_0.18_300)] dark:bg-[oklch(0.3_0.08_300)] dark:text-[oklch(0.85_0.12_300)]",
	amber: "bg-warning/20 text-warning-foreground",
	emerald: "bg-success/15 text-success",
	rose: "bg-destructive/10 text-destructive"
};
function WorkspaceSelectPage() {
	const navigate = useNavigate();
	const { user, status, logout, setActiveWorkspace } = useAuth();
	const { workspaces, isLoading } = useWorkspace();
	if (status === "unauthenticated") return /* @__PURE__ */ jsx(Navigate, { to: "/login" });
	if (user && user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: ROLE_HOME[user.role] });
	function choose(workspaceId) {
		setActiveWorkspace(workspaceId);
		navigate({ to: "/owner/dashboard" });
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex h-14 items-center justify-between border-b border-border px-4 md:px-8",
			children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsxs(Button, {
				variant: "ghost",
				size: "sm",
				onClick: async () => {
					await logout();
					navigate({ to: "/login" });
				},
				children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
			})]
		}), /* @__PURE__ */ jsxs("main", {
			className: "mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16",
			children: [
				/* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .35 },
					className: "mb-10",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: ["Welcome back, ", user?.fullName.split(" ")[0]]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 text-3xl font-semibold tracking-tight text-foreground",
							children: "Choose a workspace to continue"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: [
								"You manage ",
								workspaces.length,
								" properties. Pick one to open its dashboard. You can switch anytime from the top bar."
							]
						})
					]
				}),
				isLoading ? /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ jsx("div", { className: "h-32 animate-pulse rounded-md bg-muted/60" }, i))
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: workspaces.map((w, i) => {
						const occupancy = Math.round(w.occupiedBeds / w.totalBeds * 100);
						return /* @__PURE__ */ jsx(motion.div, {
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .3,
								delay: i * .05
							},
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => choose(w.id),
								className: "group w-full text-left outline-none",
								children: /* @__PURE__ */ jsx(Card, {
									className: "border-border/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevation-3)] group-focus-visible:ring-2 group-focus-visible:ring-ring",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ jsx("span", {
											className: cn("grid h-12 w-12 shrink-0 place-items-center rounded-md text-sm font-semibold", ACCENT[w.accent]),
											"aria-hidden": true,
											children: w.initials
										}), /* @__PURE__ */ jsxs("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("h2", {
														className: "truncate text-base font-semibold text-foreground",
														children: w.name
													}), /* @__PURE__ */ jsxs("p", {
														className: "mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground",
														children: [
															/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
															" ",
															w.city
														]
													})]
												}), /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" })]
											}), /* @__PURE__ */ jsxs("div", {
												className: "mt-4 grid grid-cols-3 gap-3 text-xs",
												children: [
													/* @__PURE__ */ jsx(Stat, {
														label: "Total beds",
														value: w.totalBeds.toString()
													}),
													/* @__PURE__ */ jsx(Stat, {
														label: "Occupied",
														value: w.occupiedBeds.toString()
													}),
													/* @__PURE__ */ jsx(Stat, {
														label: "Occupancy",
														value: `${occupancy}%`
													})
												]
											})]
										})]
									})
								})
							})
						}, w.id);
					})
				}),
				!isLoading && workspaces.length === 0 ? /* @__PURE__ */ jsxs(Card, {
					className: "flex flex-col items-center gap-3 p-12 text-center",
					children: [
						/* @__PURE__ */ jsx(Building2, { className: "h-10 w-10 text-muted-foreground" }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-base font-semibold",
							children: "No workspaces yet"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "max-w-sm text-sm text-muted-foreground",
							children: "You don't have any PG properties yet. Create one to get started."
						})
					]
				}) : null
			]
		})]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded border border-border/60 bg-muted/30 px-2 py-1.5",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm font-semibold tabular-nums text-foreground",
			children: value
		})]
	});
}
//#endregion
export { WorkspaceSelectPage as component };
