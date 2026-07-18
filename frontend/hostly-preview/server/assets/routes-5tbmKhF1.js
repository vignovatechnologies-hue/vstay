import { a as getDashboardRouteForRole, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { t as Logo } from "./logo-CiKh46W1.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { n as usePlansConfig } from "./plans-config-DbzXgPhf.js";
import { Link, Navigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Check, Loader2, LogIn } from "lucide-react";
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	const { status, user, session } = useAuth();
	if (status === "loading") return /* @__PURE__ */ jsx("div", {
		className: "grid min-h-dvh place-items-center bg-background",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" })
	});
	if (status === "authenticated" && user) {
		if (user.role === "owner" && user.workspaceIds.length > 1 && !session?.workspaceId) return /* @__PURE__ */ jsx(Navigate, { to: "/workspace-select" });
		return /* @__PURE__ */ jsx(Navigate, { to: getDashboardRouteForRole(user.role) });
	}
	return /* @__PURE__ */ jsx(Landing, {});
}
function Landing() {
	const { user, status } = useAuth();
	const [{ plans }] = usePlansConfig();
	const isAuthenticated = status === "authenticated" && !!user;
	const firstName = user?.fullName.split(" ")[0] ?? "there";
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8",
					children: [/* @__PURE__ */ jsx(Logo, {}), /* @__PURE__ */ jsx("nav", {
						className: "flex items-center gap-2",
						children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("a", {
							href: "#pricing",
							className: "hidden text-sm text-muted-foreground hover:text-foreground sm:inline",
							children: "Pricing"
						}), /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ jsx(Link, {
								to: user?.role ? ROLE_HOME[user.role] : "/login",
								children: "Dashboard"
							})
						})] }) : /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "sm",
							variant: "ghost",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/login",
								children: [/* @__PURE__ */ jsx(LogIn, { className: "mr-1 h-4 w-4" }), " Sign in"]
							})
						})
					})]
				})
			}),
			isAuthenticated ? /* @__PURE__ */ jsxs("div", {
				className: "bg-secondary/10 border-b border-border/70 py-4 text-center text-sm text-foreground/90",
				children: [
					"Welcome back, ",
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: firstName
					}),
					"! Pricing is shown below, and you can open your dashboard anytime."
				]
			}) : null,
			/* @__PURE__ */ jsxs("section", {
				className: "mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-24",
				children: [
					/* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "mb-4",
						children: "New · Laundry slot booking"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl",
						children: isAuthenticated ? `Welcome back, ${firstName}.` : "Run your PG like a modern SaaS business."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg",
						children: isAuthenticated ? "You’re signed in, and the same pricing page is available here after login." : "Track rent, resolve complaints, manage staff and give tenants a beautiful self-serve app — all in one workspace."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex flex-wrap justify-center gap-3",
						children: [isAuthenticated ? /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ jsxs("a", {
								href: "#pricing",
								children: ["See pricing ", /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1 h-4 w-4" })]
							})
						}) : null, isAuthenticated ? /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ jsx(Link, {
								to: user?.role ? ROLE_HOME[user.role] : "/login",
								children: "Open dashboard"
							})
						}) : /* @__PURE__ */ jsx(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ jsx(Link, {
								to: "/login",
								children: "Sign in"
							})
						})]
					})
				]
			}),
			isAuthenticated ? /* @__PURE__ */ jsxs("section", {
				id: "pricing",
				className: "mx-auto max-w-6xl scroll-mt-16 px-4 pb-20 md:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-semibold tracking-tight md:text-3xl",
						children: "Simple, transparent pricing"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Pick a plan that fits your PG. Cancel anytime."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2",
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
											/* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-4 w-4 text-success" }),
											" ",
											/* @__PURE__ */ jsx("span", { children: f })
										]
									}, f))
								}),
								/* @__PURE__ */ jsx(Button, {
									asChild: true,
									className: "mt-6 w-full",
									variant: p.highlighted ? "default" : "outline",
									children: /* @__PURE__ */ jsx(Link, {
										to: "/login",
										children: "Get started"
									})
								})
							]
						})
					}, p.id))
				})]
			}) : null,
			/* @__PURE__ */ jsx("footer", {
				className: "border-t border-border/60 py-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground md:flex-row md:px-8",
					children: [/* @__PURE__ */ jsxs("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Hostly. All rights reserved."
					] }), /* @__PURE__ */ jsx("p", { children: "Made for PG operators in India." })]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
