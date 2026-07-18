import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, r as SUPER_ADMIN_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { n as useLocalState } from "./local-store-DgaIVLg3.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-YNSXVwJV.js";
import { n as Switch, t as Separator } from "./separator-Bf4oMHMn.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bell, Globe, Key, Shield, User } from "lucide-react";
//#region src/routes/_authenticated.super-admin.settings.tsx?tsr-split=component
var DEFAULTS = {
	brand: {
		name: "Hostly",
		support: "support@hostly.app",
		currency: "INR (₹)",
		tz: "Asia/Kolkata",
		marketing: "https://hostly.app"
	},
	security: {
		admin2fa: true,
		owner2fa: false,
		ipAllow: false,
		sessionExpiry: true
	},
	notif: {
		signups: true,
		failed: true,
		incidents: true,
		digest: true
	}
};
function PlatformSettings() {
	const { user } = useAuth();
	const [s, setS] = useLocalState("hostly.sa.settings", DEFAULTS);
	const [draft, setDraft] = useState(s.brand);
	const [keysOpen, setKeysOpen] = useState(false);
	const [pwOpen, setPwOpen] = useState(false);
	if (!user) return null;
	if (user.role !== "super_admin") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function saveBrand() {
		setS({
			...s,
			brand: draft
		});
		toast.success("Platform settings saved");
	}
	const updSec = (k, v) => {
		setS({
			...s,
			security: {
				...s.security,
				[k]: v
			}
		});
		toast.success("Security updated");
	};
	const updNotif = (k, v) => {
		setS({
			...s,
			notif: {
				...s.notif,
				[k]: v
			}
		});
		toast.success("Notifications updated");
	};
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Platform settings",
		subtitle: "Global configuration for Hostly",
		navGroups: SUPER_ADMIN_NAV,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "lg:col-span-2 border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }), " Brand & workspace defaults"]
					}) }), /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "Platform name",
										value: draft.name,
										onChange: (v) => setDraft({
											...draft,
											name: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Support email",
										value: draft.support,
										onChange: (v) => setDraft({
											...draft,
											support: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Default currency",
										value: draft.currency,
										onChange: (v) => setDraft({
											...draft,
											currency: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Default timezone",
										value: draft.tz,
										onChange: (v) => setDraft({
											...draft,
											tz: v
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Marketing site URL" }), /* @__PURE__ */ jsx(Input, {
								value: draft.marketing,
								onChange: (e) => setDraft({
									...draft,
									marketing: e.target.value
								}),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: saveBrand,
									children: "Save changes"
								})
							})
						]
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), " Your account"]
					}) }), /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-3 text-sm",
						children: [
							/* @__PURE__ */ jsx(Row, {
								label: "Name",
								value: user.fullName
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Email",
								value: user.email
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Role",
								value: "Super Admin"
							}),
							/* @__PURE__ */ jsx(Separator, {}),
							/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full",
								onClick: () => setPwOpen(true),
								children: "Change password"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxs(Card, {
						className: "border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }), " Security"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx(Toggle, {
									label: "Enforce 2FA for all admins",
									checked: s.security.admin2fa,
									onChange: (v) => updSec("admin2fa", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Enforce 2FA for owners",
									checked: s.security.owner2fa,
									onChange: (v) => updSec("owner2fa", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "IP allowlist for admin panel",
									checked: s.security.ipAllow,
									onChange: (v) => updSec("ipAllow", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Session auto-expire · 30 min",
									checked: s.security.sessionExpiry,
									onChange: (v) => updSec("sessionExpiry", v)
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }), " Notifications"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx(Toggle, {
									label: "New owner signups",
									checked: s.notif.signups,
									onChange: (v) => updNotif("signups", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Failed payments",
									checked: s.notif.failed,
									onChange: (v) => updNotif("failed", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Security incidents",
									checked: s.notif.incidents,
									onChange: (v) => updNotif("incidents", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Weekly platform digest",
									checked: s.notif.digest,
									onChange: (v) => updNotif("digest", v)
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(Key, { className: "h-4 w-4" }), " API & integrations"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ jsx(Row, {
									label: "Payments",
									value: "Razorpay · Live"
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "SMS",
									value: "MSG91"
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Email",
									value: "Postmark"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "API status"
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: "bg-success/10 text-success",
										children: "Operational"
									})]
								}),
								/* @__PURE__ */ jsx(Separator, {}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									className: "w-full",
									onClick: () => setKeysOpen(true),
									children: "Manage API keys"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: keysOpen,
				onOpenChange: setKeysOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "API keys" }) }),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-3 text-sm",
						children: ["pk_live_hostly_84af…c1e2", "sk_live_hostly_2b91…f60a"].map((k) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-md border border-border/70 p-3 font-mono text-xs",
							children: [/* @__PURE__ */ jsx("span", { children: k }), /* @__PURE__ */ jsxs("div", {
								className: "space-x-1",
								children: [/* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										navigator.clipboard?.writeText(k);
										toast.success("Copied");
									},
									children: "Copy"
								}), /* @__PURE__ */ jsx(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => toast.success("Key rotated"),
									children: "Rotate"
								})]
							})]
						}, k))
					}),
					/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, {
						onClick: () => toast.success("New key created"),
						children: "Create key"
					}) })
				] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: pwOpen,
				onOpenChange: setPwOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Change password" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Current password" }), /* @__PURE__ */ jsx(Input, {
							type: "password",
							className: "mt-1.5"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "New password" }), /* @__PURE__ */ jsx(Input, {
							type: "password",
							className: "mt-1.5"
						})] })]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => setPwOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: () => {
							setPwOpen(false);
							toast.success("Password updated");
						},
						children: "Update"
					})] })
				] })
			})
		]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: label }), /* @__PURE__ */ jsx(Input, {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "mt-1.5"
	})] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "font-medium",
			children: value
		})]
	});
}
function Toggle({ label, checked, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ jsx(Switch, {
			checked,
			onCheckedChange: onChange
		})]
	});
}
//#endregion
export { PlatformSettings as component };
