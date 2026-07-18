import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV, o as Avatar, s as AvatarFallback } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-YNSXVwJV.js";
import { t as Textarea } from "./textarea-Cp94w9lz.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bath, BedDouble, MapPin, Snowflake, Users, Wifi } from "lucide-react";
//#region src/routes/_authenticated.tenant.room.tsx?tsr-split=component
var ROOMMATES = [
	{
		name: "Vikram Singh",
		bed: "Bed A",
		since: "Mar 2025",
		initials: "VS"
	},
	{
		name: "Arjun Kapoor",
		bed: "Bed B",
		since: "May 2025",
		initials: "AK",
		you: true
	},
	{
		name: "Nikhil Rao",
		bed: "Bed C",
		since: "Aug 2025",
		initials: "NR"
	}
];
var AMENITIES = [
	{
		icon: Wifi,
		label: "High-speed Wi-Fi"
	},
	{
		icon: Snowflake,
		label: "Air conditioning"
	},
	{
		icon: Bath,
		label: "Attached bathroom"
	},
	{
		icon: BedDouble,
		label: "Study desk & wardrobe"
	}
];
function MyRoomPage() {
	const { user } = useAuth();
	const [open, setOpen] = useState(false);
	const [pref, setPref] = useState("single");
	const [reason, setReason] = useState("");
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function submit() {
		if (!reason.trim()) {
			toast.error("Add a short reason");
			return;
		}
		toast.success("Room change request submitted");
		setReason("");
		setOpen(false);
	}
	return /* @__PURE__ */ jsx(DashboardShell, {
		title: "My room",
		subtitle: "Room 204 · Triple sharing · Second floor",
		navGroups: TENANT_NAV,
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ jsxs(Card, {
				className: "lg:col-span-2 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(CardTitle, {
						className: "text-lg",
						children: "Room 204 · Bed B"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }), " Greenhaven Residency, Indiranagar"]
					})] }), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: "bg-success/10 text-success",
						children: "Occupied"
					})]
				}) }), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ jsx(Stat, {
								label: "Floor",
								value: "2nd"
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: "Sharing",
								value: "Triple"
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: "Monthly rent",
								value: "₹ 11,500"
							}),
							/* @__PURE__ */ jsx(Stat, {
								label: "Deposit",
								value: "₹ 23,000"
							})
						]
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Amenities"
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: AMENITIES.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-md border border-border/70 bg-muted/30 p-3 text-sm",
							children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: label
							})]
						}, label))
					})] })]
				})]
			}), /* @__PURE__ */ jsxs(Card, {
				className: "border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }), " Roommates"]
				}) }), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-3",
					children: [ROOMMATES.map((r) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx(Avatar, {
							className: "h-9 w-9",
							children: /* @__PURE__ */ jsx(AvatarFallback, { children: r.initials })
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "truncate text-sm font-medium",
								children: [
									r.name,
									" ",
									r.you ? /* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: "(you)"
									}) : null
								]
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground",
								children: [
									r.bed,
									" · Since ",
									r.since
								]
							})]
						})]
					}, r.name)), /* @__PURE__ */ jsxs(Dialog, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							className: "w-full",
							onClick: () => setOpen(true),
							children: "Request room change"
						}), /* @__PURE__ */ jsxs(DialogContent, { children: [
							/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Request room change" }) }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Preferred sharing" }), /* @__PURE__ */ jsxs(Select, {
									value: pref,
									onValueChange: setPref,
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "mt-1.5",
										children: /* @__PURE__ */ jsx(SelectValue, {})
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [
										/* @__PURE__ */ jsx(SelectItem, {
											value: "single",
											children: "Single"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "double",
											children: "Double"
										}),
										/* @__PURE__ */ jsx(SelectItem, {
											value: "triple",
											children: "Triple"
										})
									] })]
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Reason" }), /* @__PURE__ */ jsx(Textarea, {
									rows: 4,
									value: reason,
									onChange: (e) => setReason(e.target.value),
									placeholder: "Help us understand your request",
									className: "mt-1.5"
								})] })]
							}),
							/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								onClick: () => setOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								onClick: submit,
								children: "Submit request"
							})] })
						] })]
					})]
				})]
			})]
		})
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
		className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("p", {
		className: "mt-1 text-base font-semibold",
		children: value
	})] });
}
//#endregion
export { MyRoomPage as component };
