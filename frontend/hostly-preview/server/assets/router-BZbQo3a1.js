import { t as ThemeProvider } from "./theme-provider-DmSyALUT.js";
import { d as db, s as sessionStorage, t as AuthProvider } from "./auth-provider-ucs5_vFo.js";
import { t as WorkspaceProvider } from "./workspace-provider-Cxe5ySHG.js";
import { useEffect, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ArrowRight, Inbox, Mail, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/styles.css?url
var styles_default = "/assets/styles-BtgHhQ98.css";
//#endregion
//#region src/providers/app-providers.tsx
function AppProviders({ children }) {
	return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(WorkspaceProvider, { children }) }) });
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/components/layout/global-simulated-inbox.tsx
function GlobalSimulatedInbox() {
	const [isOpen, setIsOpen] = useState(false);
	const [emails, setEmails] = useState(() => db.emails);
	const refreshMailbox = () => {
		setEmails([...db.emails]);
	};
	useEffect(() => {
		const interval = setInterval(() => {
			setEmails([...db.emails]);
		}, 2e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed bottom-6 right-6 z-50",
		children: /* @__PURE__ */ jsxs("button", {
			onClick: () => {
				refreshMailbox();
				setIsOpen(true);
			},
			className: "relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer",
			children: [/* @__PURE__ */ jsx(Inbox, { className: "h-6 w-6" }), emails.length > 0 && /* @__PURE__ */ jsx("span", {
				className: "absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce",
				children: emails.length
			})]
		})
	}), /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: .5 },
		exit: { opacity: 0 },
		onClick: () => setIsOpen(false),
		className: "fixed inset-0 z-50 bg-black"
	}), /* @__PURE__ */ jsxs(motion.div, {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
		transition: {
			type: "spring",
			damping: 25,
			stiffness: 200
		},
		className: "fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl sm:max-w-md border-l border-border",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-border p-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Inbox, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-semibold",
					children: "Simulated Inbox"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[10px] text-muted-foreground",
					children: "Demo simulation of sent invite emails"
				})] })]
			}), /* @__PURE__ */ jsx("button", {
				onClick: () => setIsOpen(false),
				className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
				children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex-1 overflow-y-auto p-4 space-y-4",
			children: emails.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center py-20 text-center space-y-3",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "rounded-full bg-muted p-4",
						children: /* @__PURE__ */ jsx(Mail, { className: "h-8 w-8 text-muted-foreground/60" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "font-medium text-foreground",
						children: "No Invites Sent Yet"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground max-w-[280px]",
						children: "Sign up or log in as a **PG Owner (Admin)**, go to the **Tenants** or **Staff** dashboard, add a member, and send them an access link invite."
					})
				]
			}) : emails.map((email) => /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "rounded-lg border border-border bg-card p-4 shadow-sm space-y-2 hover:border-primary/50 transition-colors",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-start gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [email.from && /* @__PURE__ */ jsxs("span", {
								className: "inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground self-start",
								children: ["From: ", email.from]
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary self-start",
								children: ["To: ", email.to]
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-muted-foreground",
							children: new Date(email.sentAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})
						})]
					}),
					/* @__PURE__ */ jsx("h4", {
						className: "text-xs font-semibold text-foreground",
						children: email.subject
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground whitespace-pre-wrap",
						children: email.body
					}),
					/* @__PURE__ */ jsx("div", {
						className: "pt-2",
						children: /* @__PURE__ */ jsxs("a", {
							href: email.linkUrl,
							onClick: () => {
								setIsOpen(false);
							},
							className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer",
							children: ["Access Portal Directly ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })]
						})
					})
				]
			}, email.id))
		})]
	})] }) })] });
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$31 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Hostly · Multi-tenant PG management" },
			{
				name: "description",
				content: "Operate every PG, every bed, every rupee — from one place."
			},
			{
				name: "author",
				content: "Hostly"
			},
			{
				property: "og:title",
				content: "Hostly · Multi-tenant PG management"
			},
			{
				property: "og:description",
				content: "Multi-tenant PG management for owners, staff and tenants."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@hostly"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$31.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(AppProviders, { children: [
			/* @__PURE__ */ jsx(Outlet, {}),
			/* @__PURE__ */ jsx(GlobalSimulatedInbox, {}),
			/* @__PURE__ */ jsx(Toaster$1, {
				richColors: true,
				closeButton: true,
				position: "top-right"
			})
		] })
	});
}
//#endregion
//#region src/routes/workspace-select.tsx
var $$splitComponentImporter$30 = () => import("./workspace-select-BxybwoWN.js");
var Route$30 = createFileRoute("/workspace-select")({
	ssr: false,
	head: () => ({ meta: [{ title: "Choose a workspace · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
//#endregion
//#region src/routes/unauthorized.tsx
var $$splitComponentImporter$29 = () => import("./unauthorized-8VrS-_eu.js");
var Route$29 = createFileRoute("/unauthorized")({
	ssr: false,
	head: () => ({ meta: [{ title: "Access denied · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$28 = () => import("./login-asyGYzc8.js");
var Route$28 = createFileRoute("/login")({
	ssr: false,
	head: () => ({ meta: [{ title: "Sign in · Hostly" }, {
		name: "description",
		content: "Sign in or sign up to your Hostly workspace."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
//#endregion
//#region src/routes/_authenticated.tsx
var $$splitComponentImporter$27 = () => import("./_authenticated-D0U_Elct.js");
/**
* Pathless layout that gates every authenticated page. Runs client-side
* only (ssr:false) so we can read the mock session from localStorage.
*/
var Route$27 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: ({ location }) => {
		if (!sessionStorage.read()) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$26 = () => import("./routes-5tbmKhF1.js");
var Route$26 = createFileRoute("/")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Hostly — Modern PG management, from bookings to billing" },
		{
			name: "description",
			content: "Run your PG or hostel with rent tracking, complaints, laundry slots and reports. Simple pricing, no setup fees."
		},
		{
			property: "og:title",
			content: "Hostly — Modern PG management"
		},
		{
			property: "og:description",
			content: "Rent tracking, complaints, laundry slots and reports for PG operators."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/_authenticated.pricing.tsx
var $$splitComponentImporter$25 = () => import("./_authenticated.pricing-DCYbHJtV.js");
var Route$25 = createFileRoute("/_authenticated/pricing")({
	head: () => ({ meta: [{ title: "Pricing · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.room.tsx
var $$splitComponentImporter$24 = () => import("./_authenticated.tenant.room-nq6urZVe.js");
var Route$24 = createFileRoute("/_authenticated/tenant/room")({
	head: () => ({ meta: [{ title: "My room · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.payments.tsx
var $$splitComponentImporter$23 = () => import("./_authenticated.tenant.payments-D84SyWs1.js");
var Route$23 = createFileRoute("/_authenticated/tenant/payments")({
	head: () => ({ meta: [{ title: "Rent & receipts · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.laundry.tsx
var $$splitComponentImporter$22 = () => import("./_authenticated.tenant.laundry-QOCNOSGl.js");
var Route$22 = createFileRoute("/_authenticated/tenant/laundry")({
	head: () => ({ meta: [{ title: "Laundry booking · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.documents.tsx
var $$splitComponentImporter$21 = () => import("./_authenticated.tenant.documents-N0parmhV.js");
var Route$21 = createFileRoute("/_authenticated/tenant/documents")({
	head: () => ({ meta: [{ title: "Documents · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.dashboard.tsx
var $$splitComponentImporter$20 = () => import("./_authenticated.tenant.dashboard-hFmZvziU.js");
var Route$20 = createFileRoute("/_authenticated/tenant/dashboard")({
	head: () => ({ meta: [{ title: "My stay · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
//#endregion
//#region src/routes/_authenticated.tenant.complaints.tsx
var $$splitComponentImporter$19 = () => import("./_authenticated.tenant.complaints-mmV5sw9O.js");
var Route$19 = createFileRoute("/_authenticated/tenant/complaints")({
	head: () => ({ meta: [{ title: "Complaints · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.settings.tsx
var $$splitComponentImporter$18 = () => import("./_authenticated.super-admin.settings-BJuR3rLC.js");
var Route$18 = createFileRoute("/_authenticated/super-admin/settings")({
	head: () => ({ meta: [{ title: "Platform settings · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.revenue.tsx
var $$splitComponentImporter$17 = () => import("./_authenticated.super-admin.revenue-2SQTyAPc.js");
var Route$17 = createFileRoute("/_authenticated/super-admin/revenue")({
	head: () => ({ meta: [{ title: "Revenue · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.reports.tsx
var $$splitComponentImporter$16 = () => import("./_authenticated.super-admin.reports-ubSzNqo9.js");
var Route$16 = createFileRoute("/_authenticated/super-admin/reports")({
	head: () => ({ meta: [{ title: "Reports · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.properties.tsx
var $$splitComponentImporter$15 = () => import("./_authenticated.super-admin.properties-CLvGWNQE.js");
var Route$15 = createFileRoute("/_authenticated/super-admin/properties")({
	head: () => ({ meta: [{ title: "Properties · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.plans.tsx
var $$splitComponentImporter$14 = () => import("./_authenticated.super-admin.plans-DFCHplNz.js");
var Route$14 = createFileRoute("/_authenticated/super-admin/plans")({
	head: () => ({ meta: [{ title: "Plans & Pricing · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.owners.tsx
var $$splitComponentImporter$13 = () => import("./_authenticated.super-admin.owners-Ball2N60.js");
var Route$13 = createFileRoute("/_authenticated/super-admin/owners")({
	head: () => ({ meta: [{ title: "Owners · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.dashboard.tsx
var $$splitComponentImporter$12 = () => import("./_authenticated.super-admin.dashboard-BfpIImDN.js");
var Route$12 = createFileRoute("/_authenticated/super-admin/dashboard")({
	head: () => ({ meta: [{ title: "Platform overview · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.audit.tsx
var $$splitComponentImporter$11 = () => import("./_authenticated.super-admin.audit-CMrS56vo.js");
var Route$11 = createFileRoute("/_authenticated/super-admin/audit")({
	head: () => ({ meta: [{ title: "Audit logs · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/_authenticated.super-admin.announcements.tsx
var $$splitComponentImporter$10 = () => import("./_authenticated.super-admin.announcements-Del94nSU.js");
var Route$10 = createFileRoute("/_authenticated/super-admin/announcements")({
	head: () => ({ meta: [{ title: "Announcements · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/_authenticated.staff.dashboard.tsx
var $$splitComponentImporter$9 = () => import("./_authenticated.staff.dashboard-BmBtXVhH.js");
var Route$9 = createFileRoute("/_authenticated/staff/dashboard")({
	head: () => ({ meta: [{ title: "Staff dashboard · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.tenants.tsx
var $$splitComponentImporter$8 = () => import("./_authenticated.owner.tenants-CkaMfaQk.js");
var Route$8 = createFileRoute("/_authenticated/owner/tenants")({
	head: () => ({ meta: [{ title: "Tenants · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.staff.tsx
var $$splitComponentImporter$7 = () => import("./_authenticated.owner.staff-BSOFOFW0.js");
var Route$7 = createFileRoute("/_authenticated/owner/staff")({
	head: () => ({ meta: [{ title: "Staff · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.settings.tsx
var $$splitComponentImporter$6 = () => import("./_authenticated.owner.settings-eRH6XKZ5.js");
var Route$6 = createFileRoute("/_authenticated/owner/settings")({
	head: () => ({ meta: [{ title: "Settings · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.rooms.tsx
var $$splitComponentImporter$5 = () => import("./_authenticated.owner.rooms-sH7MBFia.js");
var Route$5 = createFileRoute("/_authenticated/owner/rooms")({
	head: () => ({ meta: [{ title: "Rooms & Beds · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.reports.tsx
var $$splitComponentImporter$4 = () => import("./_authenticated.owner.reports-DV0Yiq6S.js");
var Route$4 = createFileRoute("/_authenticated/owner/reports")({
	head: () => ({ meta: [{ title: "Reports · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.properties.tsx
var $$splitComponentImporter$3 = () => import("./_authenticated.owner.properties-CsSgSnIF.js");
var Route$3 = createFileRoute("/_authenticated/owner/properties")({
	head: () => ({ meta: [{ title: "Properties · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.payments.tsx
var $$splitComponentImporter$2 = () => import("./_authenticated.owner.payments-JkYPGPBr.js");
var Route$2 = createFileRoute("/_authenticated/owner/payments")({
	head: () => ({ meta: [{ title: "Rent & Payments · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.dashboard.tsx
var $$splitComponentImporter$1 = () => import("./_authenticated.owner.dashboard-tuzYRDDY.js");
var Route$1 = createFileRoute("/_authenticated/owner/dashboard")({
	head: () => ({ meta: [{ title: "Owner dashboard · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_authenticated.owner.complaints.tsx
var $$splitComponentImporter = () => import("./_authenticated.owner.complaints-zhUJTVAR.js");
var Route = createFileRoute("/_authenticated/owner/complaints")({
	head: () => ({ meta: [{ title: "Complaints · Hostly" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var WorkspaceSelectRoute = Route$30.update({
	id: "/workspace-select",
	path: "/workspace-select",
	getParentRoute: () => Route$31
});
var UnauthorizedRoute = Route$29.update({
	id: "/unauthorized",
	path: "/unauthorized",
	getParentRoute: () => Route$31
});
var LoginRoute = Route$28.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$31
});
var AuthenticatedRoute = Route$27.update({
	id: "/_authenticated",
	getParentRoute: () => Route$31
});
var IndexRoute = Route$26.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$31
});
var AuthenticatedPricingRoute = Route$25.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantRoomRoute = Route$24.update({
	id: "/tenant/room",
	path: "/tenant/room",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantPaymentsRoute = Route$23.update({
	id: "/tenant/payments",
	path: "/tenant/payments",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantLaundryRoute = Route$22.update({
	id: "/tenant/laundry",
	path: "/tenant/laundry",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantDocumentsRoute = Route$21.update({
	id: "/tenant/documents",
	path: "/tenant/documents",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantDashboardRoute = Route$20.update({
	id: "/tenant/dashboard",
	path: "/tenant/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedTenantComplaintsRoute = Route$19.update({
	id: "/tenant/complaints",
	path: "/tenant/complaints",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminSettingsRoute = Route$18.update({
	id: "/super-admin/settings",
	path: "/super-admin/settings",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminRevenueRoute = Route$17.update({
	id: "/super-admin/revenue",
	path: "/super-admin/revenue",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminReportsRoute = Route$16.update({
	id: "/super-admin/reports",
	path: "/super-admin/reports",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminPropertiesRoute = Route$15.update({
	id: "/super-admin/properties",
	path: "/super-admin/properties",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminPlansRoute = Route$14.update({
	id: "/super-admin/plans",
	path: "/super-admin/plans",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminOwnersRoute = Route$13.update({
	id: "/super-admin/owners",
	path: "/super-admin/owners",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminDashboardRoute = Route$12.update({
	id: "/super-admin/dashboard",
	path: "/super-admin/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminAuditRoute = Route$11.update({
	id: "/super-admin/audit",
	path: "/super-admin/audit",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSuperAdminAnnouncementsRoute = Route$10.update({
	id: "/super-admin/announcements",
	path: "/super-admin/announcements",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedStaffDashboardRoute = Route$9.update({
	id: "/staff/dashboard",
	path: "/staff/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerTenantsRoute = Route$8.update({
	id: "/owner/tenants",
	path: "/owner/tenants",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerStaffRoute = Route$7.update({
	id: "/owner/staff",
	path: "/owner/staff",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerSettingsRoute = Route$6.update({
	id: "/owner/settings",
	path: "/owner/settings",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerRoomsRoute = Route$5.update({
	id: "/owner/rooms",
	path: "/owner/rooms",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerReportsRoute = Route$4.update({
	id: "/owner/reports",
	path: "/owner/reports",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerPropertiesRoute = Route$3.update({
	id: "/owner/properties",
	path: "/owner/properties",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerPaymentsRoute = Route$2.update({
	id: "/owner/payments",
	path: "/owner/payments",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedOwnerDashboardRoute = Route$1.update({
	id: "/owner/dashboard",
	path: "/owner/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedRouteChildren = {
	AuthenticatedPricingRoute,
	AuthenticatedOwnerComplaintsRoute: Route.update({
		id: "/owner/complaints",
		path: "/owner/complaints",
		getParentRoute: () => AuthenticatedRoute
	}),
	AuthenticatedOwnerDashboardRoute,
	AuthenticatedOwnerPaymentsRoute,
	AuthenticatedOwnerPropertiesRoute,
	AuthenticatedOwnerReportsRoute,
	AuthenticatedOwnerRoomsRoute,
	AuthenticatedOwnerSettingsRoute,
	AuthenticatedOwnerStaffRoute,
	AuthenticatedOwnerTenantsRoute,
	AuthenticatedStaffDashboardRoute,
	AuthenticatedSuperAdminAnnouncementsRoute,
	AuthenticatedSuperAdminAuditRoute,
	AuthenticatedSuperAdminDashboardRoute,
	AuthenticatedSuperAdminOwnersRoute,
	AuthenticatedSuperAdminPlansRoute,
	AuthenticatedSuperAdminPropertiesRoute,
	AuthenticatedSuperAdminReportsRoute,
	AuthenticatedSuperAdminRevenueRoute,
	AuthenticatedSuperAdminSettingsRoute,
	AuthenticatedTenantComplaintsRoute,
	AuthenticatedTenantDashboardRoute,
	AuthenticatedTenantDocumentsRoute,
	AuthenticatedTenantLaundryRoute,
	AuthenticatedTenantPaymentsRoute,
	AuthenticatedTenantRoomRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRoute: AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren),
	LoginRoute,
	UnauthorizedRoute,
	WorkspaceSelectRoute
};
var routeTree = Route$31._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
