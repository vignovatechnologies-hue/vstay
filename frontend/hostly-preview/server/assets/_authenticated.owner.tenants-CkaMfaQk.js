import { d as db, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, o as Avatar, s as AvatarFallback, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId, r as formatShortDate } from "./actions-BLzNNc_h.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-YNSXVwJV.js";
import { useMemo, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Mail, Phone, Plus, Search, Trash2, Users } from "lucide-react";
//#region src/routes/_authenticated.owner.tenants.tsx?tsr-split=component
var SEED = [
	{
		id: "t1",
		name: "Arjun Kapoor",
		initials: "AK",
		room: "204·B",
		phone: "+91 90000 11122",
		email: "arjun@mail.com",
		since: "May 2025",
		rent: "paid",
		kyc: "verified"
	},
	{
		id: "t2",
		name: "Vikram Singh",
		initials: "VS",
		room: "204·A",
		phone: "+91 98232 00981",
		email: "vikram@mail.com",
		since: "Mar 2025",
		rent: "paid",
		kyc: "verified"
	},
	{
		id: "t3",
		name: "Nikhil Rao",
		initials: "NR",
		room: "204·C",
		phone: "+91 91234 55211",
		email: "nikhil@mail.com",
		since: "Aug 2025",
		rent: "due",
		kyc: "verified"
	},
	{
		id: "t4",
		name: "Priya Sharma",
		initials: "PS",
		room: "201·A",
		phone: "+91 93000 44521",
		email: "priya@mail.com",
		since: "Jan 2025",
		rent: "paid",
		kyc: "pending"
	},
	{
		id: "t5",
		name: "Rahul Menon",
		initials: "RM",
		room: "101",
		phone: "+91 90111 22345",
		email: "rahul@mail.com",
		since: "Nov 2024",
		rent: "overdue",
		kyc: "verified"
	},
	{
		id: "t6",
		name: "Sneha Iyer",
		initials: "SI",
		room: "301·A",
		phone: "+91 98876 00021",
		email: "sneha@mail.com",
		since: "Jun 2025",
		rent: "paid",
		kyc: "verified"
	}
];
var RENT = {
	paid: "bg-success/10 text-success",
	due: "bg-warning/10 text-warning",
	overdue: "bg-destructive/10 text-destructive"
};
var KYC = {
	verified: "bg-success/10 text-success",
	pending: "bg-warning/10 text-warning"
};
function TenantsPage() {
	const { user } = useAuth();
	const { items, add, remove } = useLocalCollection("hostly.owner.tenants", SEED);
	const [q, setQ] = useState("");
	const [open, setOpen] = useState(false);
	const [view, setView] = useState(null);
	const [form, setForm] = useState({
		name: "",
		room: "",
		phone: "",
		email: ""
	});
	const filtered = useMemo(() => {
		const s = q.trim().toLowerCase();
		if (!s) return items;
		return items.filter((t) => `${t.name} ${t.room} ${t.email} ${t.phone}`.toLowerCase().includes(s));
	}, [items, q]);
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function sendInviteEmail(name, email, phone = "") {
		if (!user) return;
		if (!email || email === "—") {
			toast.error("Tenant has no email address configured");
			return;
		}
		const emailLower = email.toLowerCase().trim();
		const cleanName = name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
		const cleanPhone = (phone || "").replace(/\D/g, "");
		const generatedPassword = `${cleanName}${cleanPhone.length >= 4 ? cleanPhone.slice(-4) : cleanPhone || "0000"}`;
		if (!db.users.some((u) => u.email.toLowerCase() === emailLower)) db.users.push({
			id: `u_${shortId("t")}`,
			email: emailLower,
			fullName: name,
			phone: phone || void 0,
			role: "tenant",
			workspaceIds: user.workspaceIds,
			password: generatedPassword,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		else {
			const existingUser = db.users.find((u) => u.email.toLowerCase() === emailLower);
			if (existingUser) {
				existingUser.password = generatedPassword;
				if (phone) existingUser.phone = phone;
			}
		}
		const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=tenant`;
		const newEmail = {
			id: `email_${Date.now()}`,
			from: user.email,
			to: emailLower,
			subject: `Hostly Access Link for ${name}`,
			body: `Hello ${name},

Your PG Owner (${user.fullName} - ${user.email}) has invited you to access your Hostly Tenant Dashboard.

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
		toast.success(`Dashboard access URL sent to ${emailLower}`);
	}
	function submitAdd() {
		if (!form.name.trim() || !form.room.trim()) {
			toast.error("Name and room are required");
			return;
		}
		const parts = form.name.trim().split(/\s+/);
		const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "T";
		const tenantEmail = form.email.trim();
		add({
			id: shortId("t"),
			name: form.name,
			initials,
			room: form.room,
			phone: form.phone || "—",
			email: tenantEmail || "—",
			since: formatShortDate(),
			rent: "due",
			kyc: "pending"
		});
		if (tenantEmail) sendInviteEmail(form.name, tenantEmail, form.phone);
		setForm({
			name: "",
			room: "",
			phone: "",
			email: ""
		});
		setOpen(false);
		toast.success(`${form.name} added`);
	}
	function del(t) {
		remove(t.id);
		toast.success(`${t.name} removed`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Tenants",
		subtitle: "All active residents across your property",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total tenants",
						value: String(items.length),
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Rent paid",
						value: String(items.filter((t) => t.rent === "paid").length),
						tone: "up",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Rent due",
						value: String(items.filter((t) => t.rent !== "paid").length),
						tone: "neutral",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "KYC pending",
						value: String(items.filter((t) => t.kyc === "pending").length),
						tone: "neutral",
						icon: Users
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				className: "mt-6 border-border/70",
				children: /* @__PURE__ */ jsxs(CardContent, {
					className: "p-0",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/70 p-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative w-full max-w-xs",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								placeholder: "Search tenants…",
								className: "pl-8",
								value: q,
								onChange: (e) => setQ(e.target.value)
							})]
						}), /* @__PURE__ */ jsxs(Dialog, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ jsx(DialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add tenant"]
								})
							}), /* @__PURE__ */ jsxs(DialogContent, { children: [
								/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add tenant" }) }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid gap-3",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Full name" }), /* @__PURE__ */ jsx(Input, {
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Room" }), /* @__PURE__ */ jsx(Input, {
											value: form.room,
											onChange: (e) => setForm({
												...form,
												room: e.target.value
											}),
											placeholder: "e.g. 204·B",
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Phone" }), /* @__PURE__ */ jsx(Input, {
											value: form.phone,
											onChange: (e) => setForm({
												...form,
												phone: e.target.value
											}),
											className: "mt-1.5"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Email" }), /* @__PURE__ */ jsx(Input, {
											type: "email",
											value: form.email,
											onChange: (e) => setForm({
												...form,
												email: e.target.value
											}),
											className: "mt-1.5"
										})] })
									]
								}),
								/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									onClick: () => setOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ jsx(Button, {
									onClick: submitAdd,
									children: "Add tenant"
								})] })
							] })]
						})]
					}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableHead, { children: "Tenant" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Room" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Contact" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Since" }),
						/* @__PURE__ */ jsx(TableHead, { children: "Rent" }),
						/* @__PURE__ */ jsx(TableHead, { children: "KYC" }),
						/* @__PURE__ */ jsx(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [filtered.map((t) => /* @__PURE__ */ jsxs(TableRow, { children: [
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-8 w-8",
								children: /* @__PURE__ */ jsx(AvatarFallback, {
									className: "text-xs",
									children: t.initials
								})
							}), /* @__PURE__ */ jsx("span", {
								className: "font-medium",
								children: t.name
							})]
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "font-mono text-xs",
							children: t.room
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
									" ",
									t.phone
								]
							}), /* @__PURE__ */ jsxs("p", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
									" ",
									t.email
								]
							})]
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-muted-foreground",
							children: t.since
						}),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: RENT[t.rent],
							children: t.rent
						}) }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							className: KYC[t.kyc],
							children: t.kyc
						}) }),
						/* @__PURE__ */ jsxs(TableCell, {
							className: "text-right space-x-1",
							children: [
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setView(t),
									children: "View"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => sendInviteEmail(t.name, t.email, t.phone),
									title: "Send access link email",
									children: "Send Link"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => del(t),
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
								})
							]
						})
					] }, t.id)), filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
						colSpan: 7,
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No tenants match."
					}) })] })] })]
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!view,
				onOpenChange: (o) => !o && setView(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: view?.name }), /* @__PURE__ */ jsx(DialogDescription, { children: "Tenant profile" })] }),
					view && /* @__PURE__ */ jsxs("div", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Room:"
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: view.room
								})
							] }),
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Phone:"
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: view.phone
								})
							] }),
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Email:"
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: view.email
								})
							] }),
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Since:"
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: view.since
								})
							] }),
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "Rent:"
								}),
								" ",
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: RENT[view.rent],
									children: view.rent
								})
							] }),
							/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground",
									children: "KYC:"
								}),
								" ",
								/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: KYC[view.kyc],
									children: view.kyc
								})
							] })
						]
					}),
					/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setView(null),
						children: "Close"
					}) })
				] })
			})
		]
	});
}
//#endregion
export { TenantsPage as component };
