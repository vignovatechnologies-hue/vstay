import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-YNSXVwJV.js";
import { t as Textarea } from "./textarea-Cp94w9lz.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { MessagesSquare, Plus } from "lucide-react";
//#region src/routes/_authenticated.tenant.complaints.tsx?tsr-split=component
var INITIAL = [
	{
		id: "C-108",
		title: "AC not cooling properly",
		category: "Maintenance",
		date: "28 Nov 2026",
		status: "in_progress",
		note: "Technician assigned — visit scheduled tomorrow."
	},
	{
		id: "C-092",
		title: "Wi-Fi disconnects in the evening",
		category: "Internet",
		date: "12 Nov 2026",
		status: "resolved",
		note: "Router replaced. Please report if issue recurs."
	},
	{
		id: "C-081",
		title: "Leaking tap in bathroom",
		category: "Plumbing",
		date: "02 Nov 2026",
		status: "resolved",
		note: "Fixed by in-house plumber."
	}
];
var STATUS_STYLE = {
	open: {
		label: "Open",
		className: "bg-warning/10 text-warning"
	},
	in_progress: {
		label: "In progress",
		className: "bg-info/10 text-info"
	},
	resolved: {
		label: "Resolved",
		className: "bg-success/10 text-success"
	}
};
function ComplaintsPage() {
	const { user } = useAuth();
	const [items, setItems] = useState(INITIAL);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("Maintenance");
	const [desc, setDesc] = useState("");
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function submit() {
		if (!title.trim()) return;
		const next = {
			id: `C-${Math.floor(Math.random() * 900 + 100)}`,
			title,
			category,
			date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			}),
			status: "open",
			note: desc || "Awaiting staff review."
		};
		setItems([next, ...items]);
		setTitle("");
		setDesc("");
		setOpen(false);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Complaints",
		subtitle: "Raise and track issues with your stay",
		navGroups: TENANT_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("p", {
				className: "text-sm text-muted-foreground",
				children: [
					items.length,
					" total · ",
					items.filter((i) => i.status !== "resolved").length,
					" active"
				]
			}), /* @__PURE__ */ jsxs(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ jsx(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Button, {
						size: "sm",
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " New complaint"]
					})
				}), /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Raise a new complaint" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "ct",
									children: "Title"
								}), /* @__PURE__ */ jsx(Input, {
									id: "ct",
									value: title,
									onChange: (e) => setTitle(e.target.value),
									placeholder: "Short summary of the issue"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, { children: "Category" }), /* @__PURE__ */ jsxs(Select, {
									value: category,
									onValueChange: setCategory,
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsx(SelectContent, { children: [
										"Maintenance",
										"Plumbing",
										"Electrical",
										"Internet",
										"Housekeeping",
										"Food",
										"Security",
										"Other"
									].map((c) => /* @__PURE__ */ jsx(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "cd",
									children: "Description"
								}), /* @__PURE__ */ jsx(Textarea, {
									id: "cd",
									value: desc,
									onChange: (e) => setDesc(e.target.value),
									rows: 4,
									placeholder: "Add any details that help staff resolve this faster."
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: submit,
						children: "Submit"
					})] })
				] })]
			})]
		}), items.length === 0 ? /* @__PURE__ */ jsx(Card, {
			className: "border-dashed",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "flex flex-col items-center gap-3 p-12 text-center",
				children: [/* @__PURE__ */ jsx(MessagesSquare, { className: "h-10 w-10 text-muted-foreground" }), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "No complaints yet."
				})]
			})
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: items.map((c) => {
				const s = STATUS_STYLE[c.status];
				return /* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
								className: "text-base",
								children: c.title
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono",
										children: c.id
									}),
									" · ",
									c.category,
									" · Filed ",
									c.date
								]
							})] }), /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: cn(s.className),
								children: s.label
							})]
						})
					}), /* @__PURE__ */ jsx(CardContent, {
						className: "pt-0",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: c.note
						})
					})]
				}, c.id);
			})
		})]
	});
}
//#endregion
export { ComplaintsPage as component };
