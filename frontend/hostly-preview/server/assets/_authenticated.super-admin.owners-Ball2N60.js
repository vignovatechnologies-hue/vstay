import { d as db, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, o as Avatar, r as SUPER_ADMIN_NAV, s as AvatarFallback } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-YNSXVwJV.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Search, Users } from "lucide-react";
//#region src/routes/_authenticated.super-admin.owners.tsx?tsr-split=component
var OWNERS = [
	{
		name: "Rajesh Malhotra",
		initials: "RM",
		email: "rajesh@sunrisepg.in",
		properties: 4,
		tenants: 182,
		plan: "Scale",
		mrr: "₹ 12,996",
		status: "active",
		joined: "Mar 2024"
	},
	{
		name: "Meera Krishnan",
		initials: "MK",
		email: "meera@lotusladies.in",
		properties: 1,
		tenants: 42,
		plan: "Growth",
		mrr: "₹ 2,499",
		status: "active",
		joined: "Jul 2024"
	},
	{
		name: "Arvind Rao",
		initials: "AR",
		email: "arvind@urbannest.co",
		properties: 3,
		tenants: 128,
		plan: "Scale",
		mrr: "₹ 12,996",
		status: "active",
		joined: "Jan 2024"
	},
	{
		name: "Kavya Reddy",
		initials: "KR",
		email: "kavya@harmonyhostels.in",
		properties: 2,
		tenants: 76,
		plan: "Growth",
		mrr: "₹ 2,499",
		status: "trial",
		joined: "Nov 2026"
	},
	{
		name: "Prakash Iyer",
		initials: "PI",
		email: "prakash@greentreepg.in",
		properties: 1,
		tenants: 34,
		plan: "Starter",
		mrr: "₹ 999",
		status: "past_due",
		joined: "Sep 2025"
	},
	{
		name: "Nikhil Agarwal",
		initials: "NA",
		email: "nikhil@cozycribs.in",
		properties: 2,
		tenants: 61,
		plan: "Growth",
		mrr: "₹ 2,499",
		status: "active",
		joined: "Feb 2025"
	}
];
var STATUS = {
	active: {
		label: "Active",
		className: "bg-success/10 text-success"
	},
	trial: {
		label: "Trial",
		className: "bg-info/10 text-info"
	},
	past_due: {
		label: "Past due",
		className: "bg-destructive/10 text-destructive"
	}
};
function OwnersPage() {
	const { user } = useAuth();
	const [items, setItems] = useState(OWNERS);
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		hostelName: "",
		planId: "Starter"
	});
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function submitInvite() {
		if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.hostelName.trim()) {
			toast.error("All fields are required");
			return;
		}
		const emailLower = form.email.toLowerCase().trim();
		const cleanName = form.name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
		const cleanPhone = form.phone.replace(/\D/g, "");
		const generatedPassword = `${cleanName}${cleanPhone.length >= 4 ? cleanPhone.slice(-4) : cleanPhone || "0000"}`;
		const workspaceId = `pg_${form.hostelName.toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}`;
		const userId = `u_owner_${Date.now()}`;
		const initials = form.hostelName.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "PG";
		db.workspaces.push({
			id: workspaceId,
			name: form.hostelName,
			ownerId: userId,
			city: "Bengaluru",
			address: "12, MG Road, Bengaluru 560001",
			initials,
			totalBeds: 50,
			occupiedBeds: 0,
			accent: "blue",
			planId: form.planId === "Starter" ? "monthly" : "yearly",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		db.users.push({
			id: userId,
			email: emailLower,
			fullName: form.name,
			phone: form.phone,
			role: "owner",
			workspaceIds: [workspaceId],
			password: generatedPassword,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=owner`;
		const newEmail = {
			id: `email_${Date.now()}`,
			from: "super@hostly.app",
			to: emailLower,
			subject: `Hostly Operator Invitation for ${form.name}`,
			body: `Hello ${form.name},

You have been invited by the Hostly Super Admin (super@hostly.app) to manage your PG properties.

Your new workspace "${form.hostelName}" has been successfully created.

Use this link to log in directly:
${linkUrl}

Or log in manually at the login page using the following credentials:
- Username/Email: ${emailLower}
- Password: ${generatedPassword}

Note: The default password consists of the first 4 letters of your name and the last 4 digits of your phone number.`,
			sentAt: (/* @__PURE__ */ new Date()).toISOString(),
			linkUrl
		};
		db.emails.unshift(newEmail);
		db.save();
		const parts = form.name.trim().split(/\s+/);
		const initialsName = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "O";
		setItems([{
			name: form.name,
			initials: initialsName,
			email: emailLower,
			properties: 1,
			tenants: 0,
			plan: form.planId,
			mrr: form.planId === "Starter" ? "₹ 999" : form.planId === "Growth" ? "₹ 2,499" : "₹ 12,996",
			status: "active",
			joined: "Just now"
		}, ...items]);
		setForm({
			name: "",
			email: "",
			phone: "",
			hostelName: "",
			planId: "Starter"
		});
		setOpen(false);
		toast.success(`Invitation email sent to ${emailLower}`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Owners",
		subtitle: "Every PG operator on the Hostly platform",
		navGroups: SUPER_ADMIN_NAV,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total owners",
						value: String(items.length),
						delta: "+3 this week",
						tone: "up",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Active",
						value: String(items.filter((i) => i.status === "active").length),
						tone: "up",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "On trial",
						value: String(items.filter((i) => i.status === "trial").length),
						tone: "neutral",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Past due",
						value: String(items.filter((i) => i.status === "past_due").length),
						tone: "down",
						icon: Users
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "mt-6 border-border/70",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "p-0",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative w-full max-w-xs",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								placeholder: "Search owners…",
								className: "pl-8"
							})]
						}), /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: () => setOpen(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Invite owner"]
						})]
					}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Owner" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Properties" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Tenants" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Plan" }),
						/* @__PURE__ */ jsx(TableHead, { children: "MRR" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Joined" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsx(TableBody, { children: items.map((o) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-8 w-8",
								children: /* @__PURE__ */ jsx(AvatarFallback, { children: o.initials })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium",
								children: o.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground",
								children: o.email
							})] })]
						}) }),
						/* @__PURE__ */ jsx(TableCell, { children: o.properties }),
						/* @__PURE__ */ jsx(TableCell, { children: o.tenants }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: o.plan
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-medium",
							children: o.mrr
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-muted-foreground",
							children: o.joined
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: STATUS[o.status].className,
							children: STATUS[o.status].label
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
							})
						})
					] }, o.email)) })] })]
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "sm:max-w-[425px]",
					children: [
						/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Invite New PG Owner" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Create a PG Owner profile. An invitation email with credentials and access link will be sent." })] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 py-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "name",
										children: "Full Name"
									}), /* @__PURE__ */ jsx(Input, {
										id: "name",
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value
										}),
										placeholder: "Rohan Verma"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "email",
										children: "Email Address"
									}), /* @__PURE__ */ jsx(Input, {
										id: "email",
										type: "email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										}),
										placeholder: "rohan@sunrisepg.in"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "phone",
										children: "Phone Number"
									}), /* @__PURE__ */ jsx(Input, {
										id: "phone",
										value: form.phone,
										onChange: (e) => setForm({
											...form,
											phone: e.target.value
										}),
										placeholder: "+91 98200 12345"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "hostelName",
										children: "PG / Hostel Name"
									}), /* @__PURE__ */ jsx(Input, {
										id: "hostelName",
										value: form.hostelName,
										onChange: (e) => setForm({
											...form,
											hostelName: e.target.value
										}),
										placeholder: "Sunrise PG"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-2",
									children: [/* @__PURE__ */ jsx(Label, {
										htmlFor: "plan",
										children: "Subscription Plan"
									}), /* @__PURE__ */ jsxs("select", {
										id: "plan",
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
										value: form.planId,
										onChange: (e) => setForm({
											...form,
											planId: e.target.value
										}),
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "Starter",
												children: "Starter (₹999/mo)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Growth",
												children: "Growth (₹2,499/mo)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Scale",
												children: "Scale (₹12,996/mo)"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							onClick: submitInvite,
							children: "Send Invite"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { OwnersPage as component };
