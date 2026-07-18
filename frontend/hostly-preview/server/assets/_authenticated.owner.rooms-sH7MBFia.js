import { n as useAuth } from "./auth-provider-ucs5_vFo.js";
import { t as Button } from "./button-BpE9Czok.js";
import { a as DashboardShell, t as OWNER_NAV } from "./navigation-BC2JVMIz.js";
import { n as CardContent, t as Card } from "./card-BM637P_-.js";
import { t as Badge } from "./badge-DHlcf1ty.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DxHg2FK2.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CyFoctdv.js";
import { t as KpiCard } from "./kpi-card-CU_Ktzc8.js";
import { t as useLocalCollection } from "./local-store-DgaIVLg3.js";
import { a as shortId } from "./actions-BLzNNc_h.js";
import { t as Input } from "./input-NvmijQlt.js";
import { t as Label } from "./label-AutfcB-T.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-YNSXVwJV.js";
import { i as useRoomConfig, t as AC_OPTIONS } from "./room-config-B4f0BSbD.js";
import { useMemo, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { BedDouble, Plus, Search, Trash2 } from "lucide-react";
//#region src/routes/_authenticated.owner.rooms.tsx?tsr-split=component
var SEED = [
	{
		id: "r-101",
		room: "101",
		floor: "Ground",
		type: "Single AC",
		rent: "₹ 16,500",
		beds: "1/1",
		status: "occupied"
	},
	{
		id: "r-102",
		room: "102",
		floor: "Ground",
		type: "Double AC",
		rent: "₹ 12,000",
		beds: "2/2",
		status: "occupied"
	},
	{
		id: "r-103",
		room: "103",
		floor: "Ground",
		type: "Double AC",
		rent: "₹ 12,000",
		beds: "1/2",
		status: "partial"
	},
	{
		id: "r-201",
		room: "201",
		floor: "1st",
		type: "Triple",
		rent: "₹ 9,500",
		beds: "3/3",
		status: "occupied"
	},
	{
		id: "r-202",
		room: "202",
		floor: "1st",
		type: "Triple",
		rent: "₹ 9,500",
		beds: "0/3",
		status: "vacant"
	},
	{
		id: "r-203",
		room: "203",
		floor: "1st",
		type: "Double AC",
		rent: "₹ 12,000",
		beds: "2/2",
		status: "occupied"
	},
	{
		id: "r-204",
		room: "204",
		floor: "2nd",
		type: "Triple AC",
		rent: "₹ 11,500",
		beds: "3/3",
		status: "occupied"
	},
	{
		id: "r-205",
		room: "205",
		floor: "2nd",
		type: "Single",
		rent: "₹ 14,000",
		beds: "0/1",
		status: "maintenance"
	},
	{
		id: "r-301",
		room: "301",
		floor: "3rd",
		type: "Double",
		rent: "₹ 10,500",
		beds: "2/2",
		status: "occupied"
	},
	{
		id: "r-302",
		room: "302",
		floor: "3rd",
		type: "Triple AC",
		rent: "₹ 11,500",
		beds: "1/3",
		status: "partial"
	}
];
var STATUS = {
	occupied: "bg-success/10 text-success",
	partial: "bg-warning/10 text-warning",
	vacant: "bg-muted text-muted-foreground",
	maintenance: "bg-destructive/10 text-destructive"
};
function RoomsPage() {
	const { user } = useAuth();
	const { items, add, update, remove } = useLocalCollection("hostly.owner.rooms", SEED);
	const [config] = useRoomConfig();
	const [q, setQ] = useState("");
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [form, setForm] = useState({
		room: "",
		floor: "Ground",
		type: "Single",
		baseType: "Single",
		ac: "Non-AC",
		rent: "",
		beds: "0/1",
		status: "vacant"
	});
	const filtered = useMemo(() => {
		const s = q.trim().toLowerCase();
		if (!s) return items;
		return items.filter((r) => `${r.room} ${r.floor} ${r.type}`.toLowerCase().includes(s));
	}, [items, q]);
	const totalBeds = items.reduce((n, r) => n + Number(r.beds.split("/")[1] || 0), 0);
	const occupied = items.reduce((n, r) => n + Number(r.beds.split("/")[0] || 0), 0);
	const vacantRooms = items.filter((r) => r.status === "vacant").length;
	const maintenance = items.filter((r) => r.status === "maintenance").length;
	if (!user) return null;
	if (user.role !== "owner") return /* @__PURE__ */ jsx(Navigate, { to: "/unauthorized" });
	function openAdd() {
		setEditing(null);
		const baseType = config.types[0] ?? "Single";
		const floor = config.floors[0] ?? "Ground";
		setForm({
			room: "",
			floor,
			type: baseType,
			baseType,
			ac: "Non-AC",
			rent: "",
			beds: "0/1",
			status: "vacant"
		});
		setOpen(true);
	}
	function openEdit(r) {
		setEditing(r);
		const isAc = / AC$/i.test(r.type);
		const baseType = r.type.replace(/\s*AC$/i, "").trim() || (config.types[0] ?? "Single");
		setForm({
			room: r.room,
			floor: r.floor,
			type: r.type,
			baseType,
			ac: isAc ? "AC" : "Non-AC",
			rent: r.rent,
			beds: r.beds,
			status: r.status
		});
		setOpen(true);
	}
	function save() {
		if (!form.room.trim() || !form.rent.trim()) {
			toast.error("Room number and rent are required");
			return;
		}
		const type = form.ac === "AC" ? `${form.baseType} AC` : form.baseType;
		const payload = {
			room: form.room,
			floor: form.floor,
			type,
			rent: form.rent,
			beds: form.beds,
			status: form.status
		};
		if (editing) {
			update(editing.id, payload);
			toast.success(`Room ${form.room} updated`);
		} else {
			add({
				id: shortId("r"),
				...payload
			});
			toast.success(`Room ${form.room} added`);
		}
		setOpen(false);
	}
	function del(r) {
		remove(r.id);
		toast.success(`Room ${r.room} removed`);
	}
	return /* @__PURE__ */ jsxs(DashboardShell, {
		title: "Rooms & Beds",
		subtitle: "Inventory across floors and sharing types",
		navGroups: OWNER_NAV,
		showWorkspaceSwitcher: true,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Total rooms",
					value: String(items.length),
					icon: BedDouble
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Total beds",
					value: String(totalBeds),
					icon: BedDouble
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Occupied",
					value: String(occupied),
					delta: totalBeds ? `${Math.round(occupied / totalBeds * 100)}%` : "0%",
					tone: "up",
					icon: BedDouble
				}),
				/* @__PURE__ */ jsx(KpiCard, {
					label: "Vacant",
					value: String(vacantRooms),
					delta: `${maintenance} in maintenance`,
					tone: "neutral",
					icon: BedDouble
				})
			]
		}), /* @__PURE__ */ jsx(Card, {
			className: "mt-6 border-border/70",
			children: /* @__PURE__ */ jsxs(CardContent, {
				className: "p-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/70 p-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-full max-w-xs",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
							placeholder: "Search rooms…",
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
								onClick: openAdd,
								children: [/* @__PURE__ */ jsx(Plus, { className: "mr-1 h-4 w-4" }), " Add room"]
							})
						}), /* @__PURE__ */ jsxs(DialogContent, { children: [
							/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editing ? "Edit room" : "Add room" }) }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Room number" }), /* @__PURE__ */ jsx(Input, {
										value: form.room,
										onChange: (e) => setForm({
											...form,
											room: e.target.value
										}),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Floor" }), /* @__PURE__ */ jsxs(Select, {
										value: form.floor,
										onValueChange: (v) => setForm({
											...form,
											floor: v
										}),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "mt-1.5",
											children: /* @__PURE__ */ jsx(SelectValue, {})
										}), /* @__PURE__ */ jsx(SelectContent, { children: config.floors.map((f) => /* @__PURE__ */ jsx(SelectItem, {
											value: f,
											children: f
										}, f)) })]
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2 grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Type" }), /* @__PURE__ */ jsxs(Select, {
											value: form.baseType,
											onValueChange: (v) => setForm({
												...form,
												baseType: v
											}),
											children: [/* @__PURE__ */ jsx(SelectTrigger, {
												className: "mt-1.5",
												children: /* @__PURE__ */ jsx(SelectValue, {})
											}), /* @__PURE__ */ jsx(SelectContent, { children: config.types.map((t) => /* @__PURE__ */ jsx(SelectItem, {
												value: t,
												children: t
											}, t)) })]
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "AC / Non-AC" }), /* @__PURE__ */ jsxs(Select, {
											value: form.ac,
											onValueChange: (v) => setForm({
												...form,
												ac: v
											}),
											children: [/* @__PURE__ */ jsx(SelectTrigger, {
												className: "mt-1.5",
												children: /* @__PURE__ */ jsx(SelectValue, {})
											}), /* @__PURE__ */ jsx(SelectContent, { children: AC_OPTIONS.map((o) => /* @__PURE__ */ jsx(SelectItem, {
												value: o,
												children: o
											}, o)) })]
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Rent" }), /* @__PURE__ */ jsx(Input, {
										value: form.rent,
										placeholder: "₹ 12,000",
										onChange: (e) => setForm({
											...form,
											rent: e.target.value
										}),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Beds (occupied/total)" }), /* @__PURE__ */ jsx(Input, {
										value: form.beds,
										onChange: (e) => setForm({
											...form,
											beds: e.target.value
										}),
										className: "mt-1.5"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Status" }), /* @__PURE__ */ jsxs(Select, {
										value: form.status,
										onValueChange: (v) => setForm({
											...form,
											status: v
										}),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "mt-1.5",
											children: /* @__PURE__ */ jsx(SelectValue, {})
										}), /* @__PURE__ */ jsx(SelectContent, { children: [
											"occupied",
											"partial",
											"vacant",
											"maintenance"
										].map((s) => /* @__PURE__ */ jsx(SelectItem, {
											value: s,
											children: s
										}, s)) })]
									})] })
								]
							}),
							/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
								variant: "outline",
								onClick: () => setOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								onClick: save,
								children: editing ? "Save changes" : "Add room"
							})] })
						] })]
					})]
				}), /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableHead, { children: "Room" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Floor" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Type" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Rent" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Beds" }),
					/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
					/* @__PURE__ */ jsx(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ jsxs(TableBody, { children: [filtered.map((r) => /* @__PURE__ */ jsxs(TableRow, { children: [
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-semibold",
						children: r.room
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "text-muted-foreground",
						children: r.floor
					}),
					/* @__PURE__ */ jsx(TableCell, { children: r.type }),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-medium",
						children: r.rent
					}),
					/* @__PURE__ */ jsx(TableCell, {
						className: "font-mono text-xs",
						children: r.beds
					}),
					/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						className: STATUS[r.status],
						children: r.status
					}) }),
					/* @__PURE__ */ jsxs(TableCell, {
						className: "text-right space-x-1",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => openEdit(r),
							children: "Edit"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => del(r),
							children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" })
						})]
					})
				] }, r.id)), filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
					colSpan: 7,
					className: "text-center text-sm text-muted-foreground py-8",
					children: "No rooms match your search."
				}) })] })] })]
			})
		})]
	});
}
//#endregion
export { RoomsPage as component };
