import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { n as cn, t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, i as TENANT_NAV } from "./navigation-BC2JVMIz.js";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { CalendarDays, Check, Clock, Package, WashingMachine } from "lucide-react";
//#region src/routes/_authenticated.tenant.laundry.tsx?tsr-split=component
var SLOTS = [
	{
		time: "07:00 – 08:30",
		available: true
	},
	{
		time: "08:30 – 10:00",
		available: false
	},
	{
		time: "10:00 – 11:30",
		available: true
	},
	{
		time: "11:30 – 13:00",
		available: true
	},
	{
		time: "14:00 – 15:30",
		available: false
	},
	{
		time: "15:30 – 17:00",
		available: true
	},
	{
		time: "17:00 – 18:30",
		available: true
	},
	{
		time: "18:30 – 20:00",
		available: true
	}
];
var NEXT_DAYS = Array.from({ length: 7 }).map((_, i) => {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + i);
	return {
		key: d.toISOString().slice(0, 10),
		day: d.toLocaleDateString("en-IN", { weekday: "short" }),
		date: d.getDate(),
		label: d.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short"
		})
	};
});
var INITIAL_BOOKINGS = [{
	id: "L-2411",
	date: "28 Nov 2026",
	slot: "10:00 – 11:30",
	service: "Wash & dry",
	machine: "Machine 2",
	status: "completed"
}, {
	id: "L-2420",
	date: "02 Dec 2026",
	slot: "17:00 – 18:30",
	service: "Wash & dry",
	machine: "Machine 1",
	status: "upcoming"
}];
function LaundryPage() {
	const { user } = useAuth();
	const [dayKey, setDayKey] = useState(NEXT_DAYS[0].key);
	const [slot, setSlot] = useState(null);
	const [service, setService] = useState("wash_dry");
	const [loadKg, setLoadKg] = useState("3");
	const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
	if (!user) return null;
	if (user.role !== "tenant") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	const day = NEXT_DAYS.find((d) => d.key === dayKey);
	function confirm() {
		if (!slot) {
			toast.error("Pick a time slot first");
			return;
		}
		const b = {
			id: `L-${Math.floor(Math.random() * 900 + 100)}`,
			date: day.label,
			slot,
			service: service === "wash_dry" ? "Wash & dry" : service === "wash" ? "Wash only" : "Iron & fold",
			machine: `Machine ${Math.floor(Math.random() * 3) + 1}`,
			status: "upcoming"
		};
		setBookings([b, ...bookings]);
		setSlot(null);
		toast.success(`Slot booked for ${day.label}, ${b.slot}`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Laundry",
		subtitle: "Book a machine slot in the common laundry room",
		navGroups: TENANT_NAV,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ jsxs(Card, {
				className: "lg:col-span-2 border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(CalendarDays, { className: "h-4 w-4" }), " Choose a day"]
					})
				}), /* @__PURE__ */ jsxs(CardContent, { children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-6 grid grid-cols-4 gap-2 sm:grid-cols-7",
						children: NEXT_DAYS.map((d) => {
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									setDayKey(d.key);
									setSlot(null);
								},
								className: cn("flex flex-col items-center gap-0.5 rounded-md border py-2 text-sm transition-colors", d.key === dayKey ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-background hover:bg-accent"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-medium uppercase tracking-wider opacity-80",
									children: d.day
								}), /* @__PURE__ */ jsx("span", {
									className: "text-lg font-semibold leading-none",
									children: d.date
								})]
							}, d.key);
						})
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
							" Available slots · ",
							day.label
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
						children: SLOTS.map((s) => {
							const active = slot === s.time;
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: !s.available,
								onClick: () => setSlot(s.time),
								className: cn("rounded-md border px-3 py-2.5 text-sm font-medium transition-colors", !s.available && "cursor-not-allowed border-dashed border-border/70 bg-muted/50 text-muted-foreground line-through", s.available && !active && "border-border/70 bg-background hover:border-primary/50 hover:bg-accent", active && "border-primary bg-primary/10 text-primary"),
								children: [s.time, !s.available ? /* @__PURE__ */ jsx("span", {
									className: "ml-1 text-[10px]",
									children: "Booked"
								}) : null]
							}, s.time);
						})
					})
				] })]
			}), /* @__PURE__ */ jsxs(Card, {
				className: "border-border/70",
				children: [/* @__PURE__ */ jsx(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ jsxs(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }), " Booking details"]
					})
				}), /* @__PURE__ */ jsxs(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, { children: "Service" }), /* @__PURE__ */ jsxs(Select, {
								value: service,
								onValueChange: setService,
								children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
									/* @__PURE__ */ jsx(SelectItem, {
										value: "wash",
										children: "Wash only"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "wash_dry",
										children: "Wash & dry"
									}),
									/* @__PURE__ */ jsx(SelectItem, {
										value: "iron",
										children: "Iron & fold"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "kg",
								children: "Load (kg)"
							}), /* @__PURE__ */ jsx(Input, {
								id: "kg",
								type: "number",
								min: "1",
								max: "8",
								value: loadKg,
								onChange: (e) => setLoadKg(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-md border border-border/70 bg-muted/30 p-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Day"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: day.label
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Slot"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: slot ?? "—"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex justify-between border-t border-border/70 pt-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "Charge"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: "Included"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs(Button, {
							className: "w-full",
							onClick: confirm,
							disabled: !slot,
							children: [/* @__PURE__ */ jsx(Check, { className: "mr-1 h-4 w-4" }), " Confirm booking"]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "mt-6 border-border/70",
			children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ jsx(WashingMachine, { className: "h-4 w-4" }), " Your bookings"]
			}) }), /* @__PURE__ */ jsx(CardContent, {
				className: "space-y-2",
				children: bookings.map((b) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between rounded-md border border-border/70 p-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
						className: "text-sm font-medium",
						children: [
							b.date,
							" · ",
							b.slot
						]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono",
								children: b.id
							}),
							" · ",
							b.service,
							" · ",
							b.machine
						]
					})] }), /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: cn(b.status === "upcoming" ? "bg-info/10 text-info" : "bg-success/10 text-success"),
						children: b.status === "upcoming" ? "Upcoming" : "Completed"
					})]
				}, b.id))
			})]
		})]
	});
}
//#endregion
export { LaundryPage as component };
