import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId } from "./actions-BLzNNc_h.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { t as Textarea } from "./textarea-Cp94w9lz.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bell, Megaphone, Plus } from "lucide-react";
//#region src/routes/_authenticated.super-admin.announcements.tsx?tsr-split=component
var SEED = [
	{
		id: "p1",
		title: "Scheduled maintenance · 08 Dec, 2–4 AM IST",
		audience: "All workspaces",
		author: "Aanya M.",
		when: "2 hours ago",
		status: "scheduled",
		body: "Rolling out payments infra upgrade."
	},
	{
		id: "p2",
		title: "New: Laundry slot booking is live",
		audience: "Owners · Tenants",
		author: "Product team",
		when: "Yesterday",
		status: "published",
		body: "Tenants can now book laundry slots."
	},
	{
		id: "p3",
		title: "GST rate change effective 1 Jan",
		audience: "Owners",
		author: "Finance",
		when: "3 days ago",
		status: "published",
		body: "Updated GST slabs from January onwards."
	},
	{
		id: "p4",
		title: "Draft: Referral programme",
		audience: "Owners",
		author: "Aanya M.",
		when: "5 days ago",
		status: "draft",
		body: "One free month per referral."
	}
];
var STATUS = {
	published: "bg-success/10 text-success",
	scheduled: "bg-info/10 text-info",
	draft: "bg-muted text-muted-foreground"
};
function AnnouncementsPage() {
	const { user } = useAuth();
	const { items, add, remove } = useLocalCollection("hostly.sa.posts", SEED);
	const [form, setForm] = useState({
		title: "",
		audience: "All workspaces",
		body: ""
	});
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function submit(status) {
		if (!form.title.trim() || !form.body.trim()) {
			toast.error("Title and message are required");
			return;
		}
		add({
			id: shortId("p"),
			title: form.title,
			audience: form.audience,
			author: user.fullName,
			when: "Just now",
			status,
			body: form.body
		});
		setForm({
			title: "",
			audience: "All workspaces",
			body: ""
		});
		toast.success(status === "published" ? "Announcement published" : "Draft saved");
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Announcements",
		subtitle: "Broadcast updates to owners, staff and tenants",
		navGroups: SUPER_ADMIN_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Published",
					value: String(items.filter((p) => p.status === "published").length),
					tone: "up",
					icon: Megaphone
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Scheduled",
					value: String(items.filter((p) => p.status === "scheduled").length),
					tone: "neutral",
					icon: Bell
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Drafts",
					value: String(items.filter((p) => p.status === "draft").length),
					tone: "neutral",
					icon: Bell
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Avg. reach",
					value: "94%",
					tone: "up",
					icon: Megaphone
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ jsxs(Card, {
				className: "lg:col-span-2 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "text-base",
					children: "Recent announcements"
				}) }), /* @__PURE__ */ jsx(CardContent, {
					className: "space-y-3",
					children: items.map((p) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-border/70 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold",
									children: p.title
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										p.audience,
										" · by ",
										p.author,
										" · ",
										p.when
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: STATUS[p.status],
									children: p.status
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										remove(p.id);
										toast.success("Deleted");
									},
									children: "Delete"
								})]
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: p.body
						})]
					}, p.id))
				})]
			}), /* @__PURE__ */ jsxs(Card, {
				className: "border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New announcement"]
				}) }), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Title" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "e.g. New payments feature",
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Audience" }), /* @__PURE__ */ jsx(Input, {
							value: form.audience,
							onChange: (e) => setForm({
								...form,
								audience: e.target.value
							}),
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Message" }), /* @__PURE__ */ jsx(Textarea, {
							rows: 5,
							value: form.body,
							onChange: (e) => setForm({
								...form,
								body: e.target.value
							}),
							placeholder: "Write your announcement…",
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Button, {
								size: "sm",
								className: "flex-1",
								onClick: () => submit("published"),
								children: "Publish"
							}), /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "sm",
								className: "flex-1",
								onClick: () => submit("draft"),
								children: "Save draft"
							})]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { AnnouncementsPage as component };
