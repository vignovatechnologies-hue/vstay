import { d as db, n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, o as Avatar, s as AvatarFallback, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId } from "./actions-BLzNNc_h.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-YNSXVwJV.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Mail, Phone, Plus, Trash2, Users } from "lucide-react";
//#region src/routes/_authenticated.owner.staff.tsx?tsr-split=component
var SEED = [
	{
		id: "s1",
		name: "Devang Shah",
		initials: "DS",
		role: "Manager",
		phone: "+91 98202 33210",
		email: "devang@hostly.app",
		shift: "Day",
		status: "active"
	},
	{
		id: "s2",
		name: "Pooja Nair",
		initials: "PN",
		role: "Reception",
		phone: "+91 98111 22345",
		email: "pooja@hostly.app",
		shift: "Morning",
		status: "active"
	},
	{
		id: "s3",
		name: "Ramesh Kumar",
		initials: "RK",
		role: "Warden",
		phone: "+91 90000 88123",
		email: "ramesh@hostly.app",
		shift: "Night",
		status: "active"
	},
	{
		id: "s4",
		name: "Lakshmi Devi",
		initials: "LD",
		role: "Housekeeping",
		phone: "+91 89765 00121",
		email: "lakshmi@hostly.app",
		shift: "Morning",
		status: "active"
	},
	{
		id: "s5",
		name: "Suresh P.",
		initials: "SP",
		role: "Security",
		phone: "+91 88123 45109",
		email: "suresh@hostly.app",
		shift: "Night",
		status: "leave"
	},
	{
		id: "s6",
		name: "Anita R.",
		initials: "AR",
		role: "Cook",
		phone: "+91 90876 22105",
		email: "anita@hostly.app",
		shift: "Full day",
		status: "active"
	}
];
var STATUS = {
	active: "bg-success/10 text-success",
	leave: "bg-warning/10 text-warning"
};
function StaffPage() {
	const { user } = useAuth();
	const { items, add, remove, update } = useLocalCollection("hostly.owner.staff", SEED);
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({
		name: "",
		role: "Reception",
		phone: "",
		email: "",
		shift: "Day"
	});
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function sendInviteEmail(name, email, rawRole, phone = "") {
		if (!user) return;
		if (!email || email === "—") {
			toast.error("Staff email is required");
			return;
		}
		const emailLower = email.toLowerCase().trim();
		const resolvedRole = rawRole.toLowerCase() === "manager" ? "manager" : rawRole.toLowerCase();
		const cleanName = name.replace(/\s+/g, "").slice(0, 4).toLowerCase();
		const cleanPhone = (phone || "").replace(/\D/g, "");
		const generatedPassword = `${cleanName}${cleanPhone.length >= 4 ? cleanPhone.slice(-4) : cleanPhone || "0000"}`;
		if (!db.users.some((u) => u.email.toLowerCase() === emailLower)) db.users.push({
			id: `u_${shortId("s")}`,
			email: emailLower,
			fullName: name,
			phone: phone || void 0,
			role: resolvedRole,
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
		const linkUrl = `${window.location.origin}/login?inviteEmail=${encodeURIComponent(emailLower)}&role=${resolvedRole}`;
		const newEmail = {
			id: `email_${Date.now()}`,
			from: user.email,
			to: emailLower,
			subject: `Hostly Access Link for ${name} (${rawRole})`,
			body: `Hello ${name},

You have been invited to join the staff at your Hostly Workspace as a ${rawRole}.

Use this link to log in directly to your staff dashboard:
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
	function invite() {
		if (!form.name.trim() || !form.email.trim()) {
			toast.error("Name and email required");
			return;
		}
		const parts = form.name.trim().split(/\s+/);
		const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "S";
		const staffEmail = form.email.trim();
		add({
			id: shortId("s"),
			name: form.name,
			initials,
			role: form.role,
			phone: form.phone || "—",
			email: staffEmail,
			shift: form.shift,
			status: "active"
		});
		sendInviteEmail(form.name, staffEmail, form.role, form.phone);
		setForm({
			name: "",
			role: "Reception",
			phone: "",
			email: "",
			shift: "Day"
		});
		setOpen(false);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Staff",
		subtitle: "Manage your on-property team",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Total staff",
						value: String(items.length),
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "On duty today",
						value: String(items.filter((s) => s.status === "active").length),
						tone: "up",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "On leave",
						value: String(items.filter((s) => s.status === "leave").length),
						tone: "neutral",
						icon: Users
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						label: "Open roles",
						value: "2",
						tone: "neutral",
						icon: Users
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "All roles across shifts"
				}), /* @__PURE__ */ jsxs(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ jsx(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Invite staff"]
						})
					}), /* @__PURE__ */ jsxs(DialogContent, { children: [
						/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Invite staff" }) }),
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
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Email" }), /* @__PURE__ */ jsx(Input, {
									type: "email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									}),
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
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Role" }), /* @__PURE__ */ jsxs(Select, {
										value: form.role,
										onValueChange: (v) => setForm({
											...form,
											role: v
										}),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "mt-1.5",
											children: /* @__PURE__ */ jsx(SelectValue, {})
										}), /* @__PURE__ */ jsx(SelectContent, { children: [
											"Manager",
											"Reception",
											"Warden",
											"Housekeeping",
											"Security",
											"Cook",
											"Maintenance"
										].map((r) => /* @__PURE__ */ jsx(SelectItem, {
											value: r,
											children: r
										}, r)) })]
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Shift" }), /* @__PURE__ */ jsxs(Select, {
										value: form.shift,
										onValueChange: (v) => setForm({
											...form,
											shift: v
										}),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "mt-1.5",
											children: /* @__PURE__ */ jsx(SelectValue, {})
										}), /* @__PURE__ */ jsx(SelectContent, { children: [
											"Morning",
											"Day",
											"Night",
											"Full day"
										].map((r) => /* @__PURE__ */ jsx(SelectItem, {
											value: r,
											children: r
										}, r)) })]
									})] })]
								})
							]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							onClick: invite,
							children: "Send invite"
						})] })
					] })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: items.map((s) => /* @__PURE__ */ jsx(Card, {
					className: "border-border/70",
					children: /* @__PURE__ */ jsx(CardContent, {
						className: "p-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ jsx(Avatar, {
								className: "h-11 w-11",
								children: /* @__PURE__ */ jsx(AvatarFallback, { children: s.initials })
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-semibold",
											children: s.name
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-muted-foreground",
											children: [
												s.role,
												" · ",
												s.shift,
												" shift"
											]
										})] }), /* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: STATUS[s.status],
											children: s.status
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 space-y-1 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ jsxs("p", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
												" ",
												s.phone
											]
										}), /* @__PURE__ */ jsxs("p", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx(Mail, { className: "h-3 w-3" }),
												" ",
												s.email
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex gap-2",
										children: [
											/* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => {
													update(s.id, { status: s.status === "active" ? "leave" : "active" });
													toast.success(`${s.name} → ${s.status === "active" ? "leave" : "active"}`);
												},
												children: "Toggle status"
											}),
											/* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => sendInviteEmail(s.name, s.email, s.role, s.phone),
												children: "Send Link"
											}),
											/* @__PURE__ */ jsx(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => {
													remove(s.id);
													toast.success(`${s.name} removed`);
												},
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
											})
										]
									})
								]
							})]
						})
					})
				}, s.id))
			})
		]
	});
}
//#endregion
export { StaffPage as component };
