import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as useWorkspace } from "./workspace-provider-Cxe5ySHG.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { n as useLocalState } from "./local-store-DgaIVLg3.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-YNSXVwJV.js";
import { i as useRoomConfig, n as DEFAULT_FLOORS, r as DEFAULT_ROOM_TYPES } from "./room-config-B4f0BSbD.js";
import { n as Switch, t as Separator } from "./separator-Bf4oMHMn.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bell, Building2, CreditCard, Layers, Plus, Shield, User, X } from "lucide-react";
//#region src/routes/_authenticated.owner.settings.tsx?tsr-split=component
var DEFAULTS = {
	property: {
		name: "Lotus Ladies PG",
		gst: "27AABCU9603R1ZM",
		phone: "+91 98765 22110",
		email: "single@hostly.app",
		address: "21, Linking Road, Bandra West, Mumbai 400050"
	},
	notif: {
		rent: true,
		complaint: true,
		movement: true,
		digest: false
	},
	security: {
		twofa: true,
		loginAlerts: true,
		autoSignOut: false
	}
};
function SettingsPage() {
	const { user } = useAuth();
	const { activeWorkspace } = useWorkspace();
	const [settings, setSettings] = useLocalState("hostly.owner.settings", DEFAULTS);
	const [roomConfig, setRoomConfig] = useRoomConfig();
	const [draft, setDraft] = useState(settings.property);
	const [pwOpen, setPwOpen] = useState(false);
	const [subOpen, setSubOpen] = useState(false);
	const [sesOpen, setSesOpen] = useState(false);
	const [newFloor, setNewFloor] = useState("");
	const [newType, setNewType] = useState("");
	const activePlanId = activeWorkspace?.planId || "monthly";
	const planName = activePlanId === "yearly" ? "Yearly Plan" : "Monthly Plan";
	const planPrice = activePlanId === "yearly" ? "₹ 9,999/yr" : "₹ 999/mo";
	const bedsCount = activeWorkspace?.totalBeds || (activePlanId === "yearly" ? 60 : 50);
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function saveProperty() {
		setSettings({
			...settings,
			property: draft
		});
		toast.success("Property details saved");
	}
	function updateNotif(k, v) {
		setSettings({
			...settings,
			notif: {
				...settings.notif,
				[k]: v
			}
		});
		toast.success(`Notification updated`);
	}
	function updateSec(k, v) {
		setSettings({
			...settings,
			security: {
				...settings.security,
				[k]: v
			}
		});
		toast.success(`Security setting updated`);
	}
	function addFloor() {
		const v = newFloor.trim();
		if (!v) return;
		if (roomConfig.floors.includes(v)) {
			toast.error("Floor already exists");
			return;
		}
		setRoomConfig({
			...roomConfig,
			floors: [...roomConfig.floors, v]
		});
		setNewFloor("");
		toast.success(`Floor "${v}" added`);
	}
	function removeFloor(f) {
		setRoomConfig({
			...roomConfig,
			floors: roomConfig.floors.filter((x) => x !== f)
		});
		toast.success(`Floor "${f}" removed`);
	}
	function addType() {
		const v = newType.trim();
		if (!v) return;
		if (roomConfig.types.includes(v)) {
			toast.error("Room type already exists");
			return;
		}
		setRoomConfig({
			...roomConfig,
			types: [...roomConfig.types, v]
		});
		setNewType("");
		toast.success(`Room type "${v}" added`);
	}
	function removeType(t) {
		setRoomConfig({
			...roomConfig,
			types: roomConfig.types.filter((x) => x !== t)
		});
		toast.success(`Room type "${t}" removed`);
	}
	function resetRoomConfig() {
		setRoomConfig({
			floors: DEFAULT_FLOORS,
			types: DEFAULT_ROOM_TYPES
		});
		toast.success("Floors & room types reset to defaults");
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Settings",
		subtitle: "Property, billing and preferences",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs(Card, {
					className: "lg:col-span-2 border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }), " Property details"]
					}) }), /* @__PURE__ */ jsxs(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "Property name",
										value: draft.name,
										onChange: (v) => setDraft({
											...draft,
											name: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "GST number",
										value: draft.gst,
										onChange: (v) => setDraft({
											...draft,
											gst: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Contact phone",
										value: draft.phone,
										onChange: (v) => setDraft({
											...draft,
											phone: v
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Contact email",
										value: draft.email,
										onChange: (v) => setDraft({
											...draft,
											email: v
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Address" }), /* @__PURE__ */ jsx(Input, {
								value: draft.address,
								onChange: (e) => setDraft({
									...draft,
									address: e.target.value
								}),
								className: "mt-1.5"
							})] }),
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsx(Button, {
									size: "sm",
									onClick: saveProperty,
									children: "Save changes"
								})
							})
						]
					})]
				}), /* @__PURE__ */ jsxs(Card, {
					className: "border-border/70",
					children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), " Account"]
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
								value: "Owner"
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
						className: "lg:col-span-3 border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" }), " Floors & room types"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "grid gap-6 md:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ jsx(Label, { children: "Floors" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap gap-2",
											children: [roomConfig.floors.map((f) => /* @__PURE__ */ jsxs(Badge, {
												variant: "secondary",
												className: "gap-1 pr-1",
												children: [f, /* @__PURE__ */ jsx("button", {
													onClick: () => removeFloor(f),
													className: "ml-1 rounded hover:bg-muted-foreground/10 p-0.5",
													"aria-label": `Remove ${f}`,
													children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
												})]
											}, f)), roomConfig.floors.length === 0 && /* @__PURE__ */ jsx("span", {
												className: "text-xs text-muted-foreground",
												children: "No floors yet"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ jsx(Input, {
												placeholder: "e.g. Sixth",
												value: newFloor,
												onChange: (e) => setNewFloor(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addFloor();
													}
												}
											}), /* @__PURE__ */ jsxs(Button, {
												size: "sm",
												onClick: addFloor,
												children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add"]
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ jsx(Label, { children: "Room types" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap gap-2",
											children: [roomConfig.types.map((t) => /* @__PURE__ */ jsxs(Badge, {
												variant: "secondary",
												className: "gap-1 pr-1",
												children: [t, /* @__PURE__ */ jsx("button", {
													onClick: () => removeType(t),
													className: "ml-1 rounded hover:bg-muted-foreground/10 p-0.5",
													"aria-label": `Remove ${t}`,
													children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
												})]
											}, t)), roomConfig.types.length === 0 && /* @__PURE__ */ jsx("span", {
												className: "text-xs text-muted-foreground",
												children: "No types yet"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ jsx(Input, {
												placeholder: "e.g. Quad",
												value: newType,
												onChange: (e) => setNewType(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addType();
													}
												}
											}), /* @__PURE__ */ jsxs(Button, {
												size: "sm",
												onClick: addType,
												children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add"]
											})]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "md:col-span-2 flex justify-end",
									children: /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										onClick: resetRoomConfig,
										children: "Reset to defaults"
									})
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
									label: "Rent payment received",
									checked: settings.notif.rent,
									onChange: (v) => updateNotif("rent", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "New complaint raised",
									checked: settings.notif.complaint,
									onChange: (v) => updateNotif("complaint", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Tenant move-in / move-out",
									checked: settings.notif.movement,
									onChange: (v) => updateNotif("movement", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Weekly reports digest",
									checked: settings.notif.digest,
									onChange: (v) => updateNotif("digest", v)
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }), " Billing"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ jsx(Row, {
									label: "Plan",
									value: `${planName} · ${planPrice}`
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Next invoice",
									value: "15 Dec 2026"
								}),
								/* @__PURE__ */ jsx(Row, {
									label: "Payment method",
									value: "•••• 4021"
								}),
								/* @__PURE__ */ jsx(Separator, {}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									className: "w-full",
									onClick: () => setSubOpen(true),
									children: "Manage subscription"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs(Card, {
						className: "border-border/70",
						children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ jsx(Shield, { className: "h-4 w-4" }), " Security"]
						}) }), /* @__PURE__ */ jsxs(CardContent, {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx(Toggle, {
									label: "Two-factor authentication",
									checked: settings.security.twofa,
									onChange: (v) => updateSec("twofa", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Login alerts",
									checked: settings.security.loginAlerts,
									onChange: (v) => updateSec("loginAlerts", v)
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Auto sign-out after 30 min",
									checked: settings.security.autoSignOut,
									onChange: (v) => updateSec("autoSignOut", v)
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									className: "w-full",
									onClick: () => setSesOpen(true),
									children: "View active sessions"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(PasswordDialog, {
				open: pwOpen,
				onOpenChange: setPwOpen
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: subOpen,
				onOpenChange: setSubOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [
					/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Manage subscription" }) }),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ jsx(Row, {
								label: "Current plan",
								value: `${planName} · ${planPrice}`
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Renews on",
								value: "15 Dec 2026"
							}),
							/* @__PURE__ */ jsx(Row, {
								label: "Beds included",
								value: String(bedsCount)
							})
						]
					}),
					/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						onClick: () => {
							toast.success("Downgrade scheduled");
							setSubOpen(false);
						},
						children: "Downgrade"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: () => {
							toast.success("Upgraded to Scale");
							setSubOpen(false);
						},
						children: "Upgrade to Scale"
					})] })
				] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: sesOpen,
				onOpenChange: setSesOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Active sessions" }) }), /* @__PURE__ */ jsx("div", {
					className: "space-y-2 text-sm",
					children: [
						{
							d: "Chrome · macOS",
							i: "This device",
							w: "Now"
						},
						{
							d: "Safari · iPhone",
							i: "Mumbai, IN",
							w: "2 hours ago"
						},
						{
							d: "Chrome · Windows",
							i: "Bengaluru, IN",
							w: "Yesterday"
						}
					].map((s) => /* @__PURE__ */ jsxs("div", {
						className: "flex justify-between rounded-md border border-border/70 p-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "font-medium",
							children: s.d
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-muted-foreground",
							children: [
								s.i,
								" · ",
								s.w
							]
						})] }), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => toast.success(`Signed out from ${s.d}`),
							children: "Revoke"
						})]
					}, s.d))
				})] })
			})
		]
	});
}
function PasswordDialog({ open, onOpenChange }) {
	const [cur, setCur] = useState("");
	const [n, setN] = useState("");
	const [c, setC] = useState("");
	function submit() {
		if (!cur || !n) {
			toast.error("Fill all fields");
			return;
		}
		if (n.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (n !== c) {
			toast.error("Passwords don't match");
			return;
		}
		toast.success("Password updated");
		setCur("");
		setN("");
		setC("");
		onOpenChange(false);
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [
			/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Change password" }) }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Current password" }), /* @__PURE__ */ jsx(Input, {
						type: "password",
						value: cur,
						onChange: (e) => setCur(e.target.value),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "New password" }), /* @__PURE__ */ jsx(Input, {
						type: "password",
						value: n,
						onChange: (e) => setN(e.target.value),
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Confirm password" }), /* @__PURE__ */ jsx(Input, {
						type: "password",
						value: c,
						onChange: (e) => setC(e.target.value),
						className: "mt-1.5"
					})] })
				]
			}),
			/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ jsx(Button, {
				onClick: submit,
				children: "Update password"
			})] })
		] })
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
export { SettingsPage as component };
